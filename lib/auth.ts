import { betterAuth } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { jwt } from "better-auth/plugins";
import { MongoClient, ObjectId } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { checkPassword, PASSWORD_MIN_LENGTH } from "./password-rules";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db("pizzaPulse");

// Used by the admin sign up route to give the new account the admin role
export const authDb = db;

// The Express API checks every token against this address (issuer and audience)
const authOrigin = new URL(process.env.BETTER_AUTH_URL ?? "http://localhost:3000").origin;

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: PASSWORD_MIN_LENGTH, // 6 (Better Auth's default is 8)
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      // Password rule on the server too: 6+ characters, one uppercase, one lowercase
      if (ctx.path === "/sign-up/email") {
        const message = checkPassword(String(ctx.body?.password ?? ""));
        if (message) throw new APIError("BAD_REQUEST", { message });
      }

      // Profile updates can never change the role, the block or the plan.
      // ("role" is accepted at sign up, so Better Auth would otherwise let
      // /update-user change it too.)
      if (ctx.path === "/update-user") {
        const locked = ["role", "isBlocked", "subscriptionPlan", "subscriptionExpiresAt", "email"];
        const tried = locked.filter((key) => ctx.body && key in ctx.body);
        if (tried.length > 0) {
          throw new APIError("FORBIDDEN", {
            message: `You cannot change ${tried.join(", ")} from your profile.`,
            code: "LOCKED_FIELD",
          });
        }
      }
    }),
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    // Signs short-lived JWTs for the logged-in user (GET /api/auth/token) and
    // publishes the public keys that verify them (GET /api/auth/jwks).
    // The Express API uses these to check the Bearer token of each request.
    jwt({
      jwt: {
        issuer: authOrigin,
        audience: authOrigin,
        expirationTime: "15m", // a short life keeps a stolen token harmless
        // Only what the API needs. It reads the real role from the database.
        definePayload: ({ user }) => ({ email: user.email, role: user.role }),
      },
    }),
  ],
  user: {
    additionalFields: {
      // "customer", "vendor" or "admin"
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: true,
      },
      // Set to true by an admin. Blocked users cannot log in.
      isBlocked: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false, // nobody can set this from the sign up form
      },
      // Vendor only: the name of the shop or business
      businessName: {
        type: "string",
        required: false,
        input: true,
      },
      // "free" or "premium" (changed by the system, not by the user)
      subscriptionPlan: {
        type: "string",
        required: false,
        defaultValue: "free",
        input: false,
      },
      // When the premium plan ends (null for the free plan)
      subscriptionExpiresAt: {
        type: "date",
        required: false,
        input: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        // Public sign up (email or Google) can only make customers and vendors.
        // Anything else, including "admin", becomes customer. Admins are created
        // only by /api/admin-signup, which needs the secret ADMIN_SIGNUP_KEY.
        before: async (user) => {
          const allowed = ["customer", "vendor"];
          const role = allowed.includes(user.role as string)
            ? (user.role as string)
            : "customer";
          return { data: { ...user, role } };
        },
      },
    },
    session: {
      create: {
        // Stop blocked users from logging in (email or Google)
        before: async (session) => {
          if (!ObjectId.isValid(session.userId)) return;
          const user = await db
            .collection("user")
            .findOne({ _id: new ObjectId(session.userId) });
          if (user?.isBlocked === true) {
            // The code is how the sign in form and the Google redirect recognise it
            throw new APIError("FORBIDDEN", {
              message: "Your account has been blocked. Please contact support.",
              code: "ACCOUNT_BLOCKED",
            });
          }
        },
      },
    },
  },
});