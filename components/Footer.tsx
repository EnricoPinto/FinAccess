"use client";

import { useState } from "react";
import Link from "next/link";
import { Wallet, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";

export function Footer() {
  const [footerEmail, setFooterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (footerEmail) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setFooterEmail("");
    }
  };

  return (
    <footer className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-28 mb-12 font-sans">
      {/* Frosted Glass Plate Container with Inset Frost Highlights */}
      <div className="glass-plate p-8 sm:p-12 relative overflow-hidden">
        {/* Subtle background ambient halo */}
        <div
          className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full pointer-events-none opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(182, 217, 252, 0.18) 0%, rgba(102, 58, 243, 0.1) 60%, transparent 80%)",
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
          {/* Brand & Email Capture (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-white/[0.04] border border-glassEdge flex items-center justify-center">
                <Wallet className="w-4 h-4 text-frostGlow" />
              </div>
              <span className="font-display text-lg font-medium text-pureWhite tracking-tight">
                FinAccess
              </span>
            </div>

            <p className="text-xs text-moonMist leading-relaxed max-w-sm">
              Empowering first-time earners with real-time financial health scores, safe borrowing capacities, and bite-sized literacy modules without jargon or upselling.
            </p>

            {/* Email Capture Form: 6px frosted input + 6px Void Violet CTA */}
            <div className="pt-1">
              <label className="block text-[11px] font-mono text-fogVeil uppercase tracking-widest mb-2">
                Stay updated on financial signals
              </label>
              <form onSubmit={handleSubscribe} className="flex items-center max-w-sm gap-2">
                <input
                  type="email"
                  required
                  placeholder="username@gmail.com"
                  value={footerEmail}
                  onChange={(e) => setFooterEmail(e.target.value)}
                  className="input-frosted w-full px-3.5 py-2 text-xs"
                />
                <button
                  type="submit"
                  className="btn-void-violet text-xs py-2 px-4 whitespace-nowrap cursor-pointer"
                >
                  {subscribed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span>Subscribe</span>}
                </button>
              </form>
              {subscribed && (
                <p className="text-[11px] text-positiveMint mt-2 flex items-center space-x-1.5 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Subscribed! You’ll receive monthly financial signals.</span>
                </p>
              )}
            </div>
          </div>

          {/* 3-Column Structured Directory (7 Cols) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 pt-2">
            <div>
              <h4 className="text-xs font-mono text-fogVeil uppercase tracking-wider mb-3">
                Platform
              </h4>
              <ul className="space-y-2 text-xs text-moonMist">
                <li><Link href="/dashboard" className="hover:text-pureWhite transition-colors">Health Engine</Link></li>
                <li><Link href="/tracker" className="hover:text-pureWhite transition-colors">Cashflow Tracker</Link></li>
                <li><Link href="/goals" className="hover:text-pureWhite transition-colors">What-If Simulator</Link></li>
                <li><Link href="/loans" className="hover:text-pureWhite transition-colors">Loan Eligibility</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-mono text-fogVeil uppercase tracking-wider mb-3">
                Literacy Topics
              </h4>
              <ul className="space-y-2 text-xs text-moonMist">
                <li><Link href="/literacy" className="hover:text-pureWhite transition-colors">All 11 Explainer Cards</Link></li>
                <li><Link href="/literacy?module=emergency-fund-basics" className="hover:text-pureWhite transition-colors">Emergency Reserves</Link></li>
                <li><Link href="/literacy?module=understanding-dti-ratio" className="hover:text-pureWhite transition-colors">DTI Mechanics</Link></li>
                <li><Link href="/literacy?module=50-30-20-rule" className="hover:text-pureWhite transition-colors">50/30/20 Rule</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-mono text-fogVeil uppercase tracking-wider mb-3">
                Principles
              </h4>
              <ul className="space-y-2 text-xs text-moonMist">
                <li className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blueprintBlue" />
                  <span>Zero Upselling</span>
                </li>
                <li><span>No Hard Bureau Pulls</span></li>
                <li><span>Zero Sponsor Bias</span></li>
                <li><span>Local Client Privacy</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Protocol Bar */}
        <div className="mt-12 pt-6 border-t border-glassEdge flex flex-col sm:flex-row items-center justify-between text-[11px] text-fogVeil gap-4">
          <p>© 2026 FinAccess. Built for the DPUIX-FSD Financial Inclusion Initiative.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-moonMist transition-colors cursor-pointer">Privacy Protocol</span>
            <span className="hover:text-moonMist transition-colors cursor-pointer">Security Standards</span>
            <span className="hover:text-moonMist transition-colors cursor-pointer">AuthKit Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
