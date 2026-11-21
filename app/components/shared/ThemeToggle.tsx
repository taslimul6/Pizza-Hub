"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

// Sun / moon button that switches between light and dark mode.
// The icons are chosen with CSS (dark:), so the server and the browser
// render the same markup and nothing flickers on load.
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="Switch between light and dark mode"
      title="Light / dark mode"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={className}
    >
      <Sun className="size-5 dark:hidden" aria-hidden="true" />
      <Moon className="hidden size-5 dark:block" aria-hidden="true" />
    </Button>
  );
}
