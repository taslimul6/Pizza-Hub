import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { isAPIError } from "better-auth/api";
import { auth, authDb } from "@/lib/auth";
import { checkPassword } from "@/lib/password-rules";

// POST /api/admin-signup  { name, email, password, adminKey }
// Creates an admin account. Only works with the secret ADMIN_SIGNUP_KEY from .env,
// so admins cannot be created through the public sign up page.
// 1. check the key (constant-time compare),
// 2. create a normal account with Better Auth (the sign up hook makes it a customer),
// 3. only then change the role to "admin" in the database.

function sameKey(given: string, expected: string) {
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const expected = process.env.ADMIN_SIGNUP_KEY;
  if (!expected) {
    return NextResponse.json({ error: "Admin sign up is turned off." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const name = String(body?.name ?? "").trim();
  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");
  const adminKey = String(body?.adminKey ?? "");

  if (!sameKey(adminKey, expected)) {
    return NextResponse.json({ error: "The admin key is not correct." }, { status: 403 });
  }
  if (name.length < 2 || name.length > 60) {
    return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }
  const passwordError = checkPassword(password);
  if (passwordError) {
    return NextResponse.json({ error: passwordError }, { status: 400 });
  }

  // Create the account (as a customer first)
  let userId: string;
  try {
    const result = await auth.api.signUpEmail({ body: { name, email, password } });
    userId = result.user.id;
  } catch (err) {
    const message = isAPIError(err) ? err.message : "Could not create the account.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  // Now make it an admin
  await authDb
    .collection("user")
    .updateOne({ _id: new ObjectId(userId) }, { $set: { role: "admin", updatedAt: new Date() } });

  return NextResponse.json({ message: "Admin account created" }, { status: 201 });
}
