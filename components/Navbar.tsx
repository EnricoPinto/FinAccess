"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  Wallet,
  LayoutDashboard,
  Receipt,
  Target,
  CreditCard,
  BookOpen,
  Trash2,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  LogOut,
  User,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loadingReset, setLoadingReset] = useState(false);
  const [resetStatus, setResetStatus] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/tracker", label: "Tracker", icon: Receipt },
    { href: "/goals", label: "Savings Goals", icon: Target },
    { href: "/loans", label: "Loan Eligibility", icon: CreditCard },
    { href: "/literacy", label: "Literacy Cards", icon: BookOpen },
  ];

  const isAppPage = navLinks.some((l) => pathname.startsWith(l.href));

  const handleResetData = async () => {
    if (!confirm("Reset all financial data to start with a fresh blank profile?")) {
      return;
    }
    try {
      setLoadingReset(true);
      setResetStatus("Clearing...");
      const res = await fetch("/api/user/reset", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setResetStatus("Cleared!");
        setTimeout(() => setResetStatus(null), 3000);
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      setResetStatus("Failed");
    } finally {
      setLoadingReset(false);
    }
  };

  const handleSignOut = async () => {
    setLoggingOut(true);
    await signOut({ callbackUrl: "/auth" });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-glassEdge bg-[#05060f]/80 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 rounded-full bg-white/[0.04] border border-glassEdge flex items-center justify-center transition-all group-hover:border-frostGlow/40 group-hover:bg-white/[0.08]">
            <Wallet className="w-4 h-4 text-frostGlow" />
          </div>
          <div>
            <span className="font-display text-base font-medium tracking-tight text-pureWhite group-hover:text-frostGlow transition-colors">
              FinAccess
            </span>
            <span className="text-[10px] block font-mono text-fogVeil uppercase tracking-widest">
              Cathedral Intelligence
            </span>
          </div>
        </Link>

        {/* Center Navigation Links — only shown when signed in */}
        {status === "authenticated" && (
          <nav className="hidden md:flex items-center space-x-1.5 p-1 rounded-full bg-white/[0.02] border border-glassEdge">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs transition-all ${
                    isActive
                      ? "bg-white/[0.08] text-pureWhite font-medium shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] border border-glassEdge"
                      : "text-moonMist hover:text-pureWhite hover:bg-white/[0.04]"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-frostGlow" : "text-fogVeil"}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {status === "authenticated" ? (
            <>
              {/* User identity chip */}
              <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-glassEdge text-xs text-fogVeil">
                <User className="w-3 h-3 text-frostGlow" />
                <span className="font-mono truncate max-w-[120px]">{session?.user?.email?.split("@")[0]}</span>
              </div>

              {/* Reset data button — only on app pages */}
              {isAppPage && (
                <button
                  onClick={handleResetData}
                  disabled={loadingReset}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/[0.03] hover:bg-negativeCoral/10 text-moonMist hover:text-negativeCoral border border-glassEdge transition-all cursor-pointer disabled:opacity-40"
                  title="Reset data"
                >
                  {loadingReset ? (
                    <RefreshCw className="w-3 h-3 animate-spin text-negativeCoral" />
                  ) : resetStatus ? (
                    <CheckCircle2 className="w-3 h-3 text-positiveMint" />
                  ) : (
                    <Trash2 className="w-3 h-3 text-fogVeil" />
                  )}
                  <span>{resetStatus || "Reset"}</span>
                </button>
              )}

              {/* Sign Out */}
              <button
                onClick={handleSignOut}
                disabled={loggingOut}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/[0.03] hover:bg-white/[0.06] text-moonMist hover:text-pureWhite border border-glassEdge transition-all cursor-pointer disabled:opacity-40"
                title="Sign out"
              >
                {loggingOut ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : (
                  <LogOut className="w-3 h-3 text-fogVeil" />
                )}
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </>
          ) : (
            /* Not signed in — show sign in CTA */
            pathname !== "/auth" && (
              <Link
                href="/auth"
                className="btn-void-violet text-xs py-2 px-4 whitespace-nowrap cursor-pointer group"
              >
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            )
          )}
        </div>
      </div>

      {/* Mobile navigation bar — only shown when signed in */}
      {status === "authenticated" && (
        <div className="md:hidden flex items-center justify-around py-2 border-t border-glassEdge bg-[#05060f]/95">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center py-1 px-2 text-[10px] ${
                  isActive ? "text-pureWhite font-medium" : "text-fogVeil"
                }`}
              >
                <Icon className="w-4 h-4 mb-0.5" />
                <span>{link.label.split(" ")[0]}</span>
              </Link>
            );
          })}
          {/* Mobile sign out */}
          <button
            onClick={handleSignOut}
            className="flex flex-col items-center py-1 px-2 text-[10px] text-fogVeil"
          >
            <LogOut className="w-4 h-4 mb-0.5" />
            <span>Out</span>
          </button>
        </div>
      )}
    </header>
  );
}
