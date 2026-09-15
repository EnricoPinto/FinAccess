import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "FinAccess — Financial Intelligence & Product Discovery",
  description:
    "FinAccess translates complex cashflow and loan eligibility data into plain-English financial health scores, goal timelines, and transparent borrowing limits.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-blueprint-grid text-frostGlow min-h-screen flex flex-col antialiased selection:bg-voidViolet selection:text-white font-sans">
        <Providers>
          <Navbar />
          <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
