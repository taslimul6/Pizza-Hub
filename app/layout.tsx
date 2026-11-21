import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import Footer from "./components/shared/Footer";
import HideOnAdmin from "./components/shared/HideOnAdmin";
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
    >
      <body className="min-h-full flex flex-col">
        {/* Navbar reads the login session itself (guest or logged in) */}
        <Navbar />
        {children}
        {/* The admin panel is an app screen: no marketing footer there */}
        <HideOnAdmin>
          <Footer />
        </HideOnAdmin>
        {/* Shows toast messages (e.g. "Signed in successfully") */}
        <Toaster theme="light" position="top-center" richColors />
      </body>
    </html>
  );
}
