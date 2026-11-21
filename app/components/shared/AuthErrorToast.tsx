"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

// Shows a toast when a login fails and the user lands here with ?error=...
//   ?error=ACCOUNT_BLOCKED  -> the account is blocked (email or Google login)
//   any other ?error=...    -> Google login failed for another reason
// Then it removes the error from the address bar.
export default function AuthErrorToast() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const error = params.get("error");
  const description = params.get("error_description");
  // Only once, even if React runs the effect twice in development
  const shown = useRef(false);

  useEffect(() => {
    if (!error || shown.current) return;
    shown.current = true;

    if (error === "ACCOUNT_BLOCKED") {
      toast.error("Your account has been blocked", {
        description: "You cannot sign in right now. Please contact support if you think this is a mistake.",
        duration: 8000,
      });
    } else {
      toast.error("Could not sign in", {
        description: description ?? "Please try again.",
      });
    }

    router.replace(pathname);
  }, [error, description, pathname, router]);

  return null;
}
