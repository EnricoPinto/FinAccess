import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — FinAccess",
  description: "Sign in or create your FinAccess account to track your finances securely.",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
