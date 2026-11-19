import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "@/lib/auth";

// Client used by the sign in / sign up forms.
// No baseURL needed: the app and the auth API are on the same domain.
// inferAdditionalFields lets the client know about our custom "role" field.
export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
});

export const { signIn, signUp, useSession } = authClient;
