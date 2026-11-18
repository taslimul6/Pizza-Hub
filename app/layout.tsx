import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import Navbar from "./components/navbar/Navbar";
import "./globals.css";

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
        {/* Guest navbar for now; real auth state will be wired in later. */}
        <Navbar />
        {children}
      </body>
    </html>
  );
}
