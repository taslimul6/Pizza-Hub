import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { MongoClient, ObjectId } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db("pizzaPulse");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
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
        // Only these roles are accepted from signup; anything else becomes
        // customer. NOTE: "admin" is open to anyone who signs up.
        before: async (user) => {
          const allowed = ["customer", "vendor", "admin"];
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
            throw new APIError("FORBIDDEN", {
              message: "Your account has been blocked. Please contact support.",
            });
          }
        },
      },
    },
  },
});