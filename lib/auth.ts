import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
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
  },
});