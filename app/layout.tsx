import type { Metadata } from "next";
import { Suspense } from "react";
import { DM_Sans, Fraunces } from "next/font/google";
import Footer from "./components/shared/Footer";
import HideOnDashboard from "./components/shared/HideOnDashboard";
import ThemeProvider from "./components/shared/ThemeProvider";
import Navbar from "./components/shared/Navbar";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

// Brand fonts (see docs): Fraunces for headings, DM Sans for body text.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PizzaHub",
  description: "Hot, fresh, and on its way.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${dmSans.variable} h-full antialiased`}
      // next-themes adds the "dark" class before React starts
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
        {/* Navbar reads the login session itself (guest or logged in) */}
        <Navbar />
        {children}
        {/* The dashboards are app screens: no marketing footer there */}
        {/* usePathname() must sit inside Suspense so dynamic routes can prerender */}
        <Suspense fallback={null}>
        <HideOnDashboard>
          <Footer />
        </HideOnDashboard>
        </Suspense>
        {/* Shows toast messages (e.g. "Signed in successfully") */}
        <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
