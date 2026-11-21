"use client";

import type { ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// Light / dark mode. next-themes puts "dark" on <html> and remembers the choice.
// It follows the device setting until the user picks one with the toggle.
export default function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </NextThemesProvider>
  );
}
