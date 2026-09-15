"use client";

import { useEffect, useState } from "react";
import {
  CreditCard,
  HelpCircle,
  ShieldCheck,
  Building2,
  Sparkles,
  ArrowUpRight,
  RefreshCw,
  Info,
  Filter,
  Clock,
  CheckCircle2,
  X,
} from "lucide-react";
import Link from "next/link";
import CountUp from "@/components/motion/CountUp";

interface LoanProduct {
  id: string;
  name: string;
  category: string;
  minInterestRate: number;
  maxInterestRate: number;
  minIncome: number;
  maxAmount: number;
  tenureMonths: number;
  provider: string;
  description: string;
}

interface Assessment {
  product: LoanProduct;
  eligible: boolean;
  statusTag: "Likely Eligible" | "Moderate Match" | "Higher Risk / Ineligible";
  statusColor: string;
  estimatedMaxAmount: number;
  estimatedMonthlyEMI: number;
  reason: string;
}

interface SummaryData {
  maxBorrowingCapacity: number;
  maxAvailableEMI: number;
  dtiRatio: number;
  evaluations: Assessment[];
}

export default function LoansPage() {
  const [income, setIncome] = useState<number | string>(45000);
  const [obligations, setObligations] = useState<number | string>(0);
  const [age, setAge] = useState<number | string>(22);

  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Add to EMI Tracker state
  const [selectedLoanForTracker, setSelectedLoanForTracker] = useState<Assessment | null>(null);
  const [trackerDueDay, setTrackerDueDay] = useState("5");
  const [trackingSubmitting, setTrackingSubmitting] = useState(false);
  const [addedSuccessId, setAddedSuccessId] = useState<string | null>(null);

  const handleAddToTracker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoanForTracker) return;

    const { product, estimatedMonthlyEMI } = selectedLoanForTracker;
    try {
      setTrackingSubmitting(true);
      const res = await fetch("/api/emis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: product.name,
          type: "LOAN",
          principalAmount: product.maxAmount,
          interestRate: product.minInterestRate,
          tenureMonths: product.tenureMonths,
          monthlyInstallment: estimatedMonthlyEMI,
          dueDay: parseInt(trackerDueDay, 10),
          linkedLoanProductId: product.id,
        }),
      });

      if (res.ok) {
        setAddedSuccessId(product.id);
        setSelectedLoanForTracker(null);
        setTimeout(() => setAddedSuccessId(null), 4000);
      }
    } catch (err) {
      console.error("Failed to add to tracker:", err);
    } finally {
      setTrackingSubmitting(false);
    }
  };

  const runEligibilityCheck = async (
    userInc: number,
    userOb: number,
    userAge: number
  ) => {
    try {
      setEvaluating(true);
      const res = await fetch("/api/loans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monthlyIncome: Math.max(userInc, 0),
          existingObligations: Math.max(userOb, 0),
          age: Math.max(userAge, 18),
        }),
      });
      const data = await res.json();
      setSummary(data.summary);
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const [uRes, txRes] = await Promise.all([
          fetch("/api/user"),
          fetch("/api/transactions"),
        ]);
        const uData = await uRes.json();
        const txData = await txRes.json();

        let inc = typeof uData.user?.monthlyIncome === "number" ? uData.user.monthlyIncome : 0;
        const txInc = (txData.transactions || [])
          .filter((t: any) => t.type === "INCOME")
          .reduce((sum: number, t: any) => sum + t.amount, 0);

        if (inc === 0 && txInc > 0) {
          inc = txInc;
        }

        const ob = typeof uData.user?.existingObligations === "number" ? uData.user.existingObligations : 0;
        const a = typeof uData.user?.age === "number" ? uData.user.age : 22;

        setIncome(inc);
        setObligations(ob);
        setAge(a);
        runEligibilityCheck(inc, ob, a);
      } catch (err) {
        runEligibilityCheck(0, 0, 22);
      }
    };
    init();
  }, []);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    runEligibilityCheck(Number(income) || 0, Number(obligations) || 0, Number(age) || 22);
  };

  const filteredEvaluations = summary?.evaluations.filter((ev) => {
    if (categoryFilter === "ALL") return true;
    return ev.product.category.toLowerCase().includes(categoryFilter.toLowerCase());
  }) || [];

  return (
    <div className="space-y-12 animate-fadeIn font-sans">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-fogVeil uppercase tracking-widest">
            Loan Options & Underwriting
          </span>
          <span className="badge-frost text-[10px]">Prudent DTI</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-medium text-pureWhite mt-1">
          Loan Comparison & Eligibility Estimator
        </h1>
        <p className="text-xs text-moonMist mt-1">
          Know what loans you qualify for before applying — rule-based & non-judgmental.
        </p>
      </div>

      {/* INPUT PROFILE BAR & CAPACITY SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Input Controls in Frosted Plate */}
        <div className="glass-plate p-6 space-y-4">
          <div className="flex items-center space-x-2 text-pureWhite">
            <ShieldCheck className="w-4 h-4 text-blueprintBlue" />
            <h2 className="font-display text-base font-medium">Financial Parameters</h2>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-fogVeil font-mono uppercase text-[11px] tracking-wider mb-1.5">
                Gross Monthly Income (₹)
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                placeholder="e.g. 45000"
                value={income === 0 ? "0" : income || ""}
                onChange={(e) => setIncome(e.target.value === "" ? "" : Math.max(Number(e.target.value) || 0, 0))}
                className="input-frosted w-full px-3.5 py-2 text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-fogVeil font-mono uppercase text-[11px] tracking-wider mb-1.5">
                Existing Monthly EMIs / Debts (₹)
              </label>
              <input
                type="number"
                min="0"
                step="500"
                placeholder="e.g. 5000"
                value={obligations === 0 ? "0" : obligations || ""}
                onChange={(e) => setObligations(e.target.value === "" ? "" : Math.max(Number(e.target.value) || 0, 0))}
                className="input-frosted w-full px-3.5 py-2 text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-fogVeil font-mono uppercase text-[11px] tracking-wider mb-1.5">Age (Years)</label>
              <input
                type="number"
                min="18"
                max="75"
                placeholder="e.g. 24"
                value={age === 0 ? "0" : age || ""}
                onChange={(e) => setAge(e.target.value === "" ? "" : Math.max(Number(e.target.value) || 18, 0))}
                className="input-frosted w-full px-3.5 py-2 text-sm font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={evaluating}
              className="btn-void-violet w-full text-xs py-2.5 cursor-pointer disabled:opacity-50"
            >
              {evaluating ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>Recalculate Eligibility</span>
            </button>
          </form>
        </div>

        {/* Capacity Summary Cards */}
        <div className="lg:col-span-2 glass-plate p-6 flex flex-col justify-between space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-glassEdge pb-4">
            <div>
              <span className="text-[11px] font-mono text-fogVeil uppercase tracking-widest block">
                Rule-Based Underwriting Model
              </span>
              <h2 className="font-display text-xl font-medium text-pureWhite mt-0.5">
                Maximum Borrowing Capacity
              </h2>
            </div>
            <div className="badge-frost text-xs">
              50% DTI Cap
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-glassEdge space-y-1 card-tactile">
              <div className="text-xs text-fogVeil font-mono">Max Estimated Borrow</div>
              <div className="font-display text-2xl font-medium text-frostGlow font-mono tabular-nums">
                <CountUp value={summary?.maxBorrowingCapacity || 0} prefix="₹" isCurrency />
              </div>
              <div className="text-[11px] text-fogVeil font-mono">3-year tenure basis</div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-glassEdge space-y-1 card-tactile">
              <div className="flex items-center justify-between text-xs text-fogVeil font-mono">
                <span>DTI Ratio</span>
                <Link href="/literacy?module=understanding-dti-ratio" title="What is DTI?">
                  <HelpCircle className="w-3.5 h-3.5 text-fogVeil hover:text-pureWhite transition-colors" />
                </Link>
              </div>
              <div className="font-display text-2xl font-medium text-pureWhite font-mono tabular-nums">
                <CountUp value={summary?.dtiRatio ? Number(summary.dtiRatio.toFixed(1)) : 0} suffix="%" decimals={1} />
              </div>
              <div className="text-[11px] text-positiveMint font-mono">
                {(summary?.dtiRatio || 0) <= 35 ? "Healthy Threshold" : "Moderate Leverage"}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-glassEdge space-y-1 card-tactile">
              <div className="text-xs text-fogVeil font-mono">Safe Monthly EMI Margin</div>
              <div className="font-display text-2xl font-medium text-pureWhite font-mono tabular-nums">
                <CountUp value={summary?.maxAvailableEMI || 0} prefix="₹" isCurrency />
              </div>
              <div className="text-[11px] text-fogVeil font-mono">50% income ceiling</div>
            </div>
          </div>

          <div className="p-3 rounded-md bg-white/[0.02] border border-glassEdge flex items-center space-x-2 text-[11px] text-fogVeil font-mono">
            <Info className="w-3.5 h-3.5 text-blueprintBlue flex-shrink-0" />
            <span>
              Disclaimer: Rule-based DTI estimate. FinAccess does not issue loans, run bureau inquiries, or sell personal data.
            </span>
          </div>
        </div>
      </div>

      {/* LOAN COMPARISON GRID */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-medium text-pureWhite">
              Genuine Bank Loan Products & Eligibility
            </h2>
            <p className="text-xs text-moonMist">
              Evaluated specifically against your monthly cash flow & income profile.
            </p>
          </div>

          {/* Category Filter Pills with smooth tactile feedback */}
          <div className="flex items-center space-x-1.5 p-1 rounded-full bg-white/[0.02] border border-glassEdge text-xs overflow-x-auto max-w-full scrollbar-none">
            <Filter className="w-3.5 h-3.5 text-fogVeil ml-2 flex-shrink-0" />
            {[
              "ALL",
              "Personal",
              "Education",
              "Two-Wheeler",
              "Home",
              "Business",
              "Auto",
              "Consumer Durable",
              "Gold / Secured",
            ].map((cat) => {
              const isActive = categoryFilter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`tab-pill px-3.5 py-1.5 ${
                    isActive ? "tab-pill-active" : ""
                  }`}
                >
                  <span className="relative z-10 flex items-center space-x-1.5">
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blueprintBlue animate-pulse shadow-[0_0_8px_#b6d9fc]" />
                    )}
                    <span>{cat}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4-Column Product Cards Grid with smooth transition */}
        <div key={categoryFilter} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn transition-all duration-300">
          {filteredEvaluations.map((item) => {
            const p = item.product;
            const statusTag = item.statusTag;

            return (
              <div
                key={p.id}
                className="glass-plate glass-plate-hover card-tactile p-6 flex flex-col justify-between space-y-4 relative"
              >
                {/* Header Badge */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="badge-frost text-[9px]">
                      {p.category}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium border ${
                        item.eligible
                          ? "bg-positiveMint/10 text-positiveMint border-positiveMint/30"
                          : statusTag.includes("Moderate")
                          ? "bg-white/[0.06] text-frostGlow border-glassEdge"
                          : "bg-negativeCoral/10 text-negativeCoral border-negativeCoral/30"
                      }`}
                    >
                      {item.statusTag}
                    </span>
                  </div>

                  <h3 className="font-display text-base font-medium text-pureWhite line-clamp-2">{p.name}</h3>

                  <div className="flex items-center space-x-1.5 text-xs text-fogVeil">
                    <Building2 className="w-3.5 h-3.5 text-blueprintBlue" />
                    <span className="font-mono">{p.provider}</span>
                  </div>

                  <p className="text-xs text-moonMist leading-relaxed line-clamp-3 pt-1">
                    {p.description}
                  </p>
                </div>

                {/* Key Numbers */}
                <div className="space-y-2 pt-3 border-t border-glassEdge text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-fogVeil">Interest APR:</span>
                    <span className="font-medium text-frostGlow">
                      {p.minInterestRate}% - {p.maxInterestRate}%
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-fogVeil">Min. Monthly Income:</span>
                    <span className="font-medium text-pureWhite">
                      ₹{p.minIncome.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-fogVeil">Tenure:</span>
                    <span className="font-medium text-pureWhite">{p.tenureMonths} months</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-fogVeil">Est. EMI / Month:</span>
                    <span className="font-medium text-frostGlow">
                      ₹{item.estimatedMonthlyEMI.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Reason Explanation Box */}
                <div className="p-3 rounded-md bg-white/[0.02] border border-glassEdge text-[11px] text-moonMist leading-normal font-mono">
                  <div className="font-medium text-fogVeil mb-1 uppercase tracking-wider text-[10px]">Assessment:</div>
                  {item.reason}
                </div>

                {/* Actions */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedLoanForTracker(item)}
                    className="btn-void-violet w-full flex items-center justify-center space-x-1.5 text-xs py-2 cursor-pointer card-tactile"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {addedSuccessId === p.id ? "Added to EMI Tracker ✓" : "Add to EMI Tracker"}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Loan to EMI Tracker Modal */}
      {selectedLoanForTracker && (
        <div className="fixed inset-0 z-[250] bg-[#05060f]/80 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn">
          <div className="glass-plate max-w-md w-full p-6 space-y-5 border border-glassEdge shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-glassEdge pb-3">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-frostGlow" />
                <h3 className="font-display text-lg font-medium text-pureWhite">
                  Track Loan in EMI Tracker
                </h3>
              </div>
              <button
                onClick={() => setSelectedLoanForTracker(null)}
                className="p-1 text-fogVeil hover:text-pureWhite transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddToTracker} className="space-y-4">
              <div className="p-3.5 rounded-lg bg-white/[0.03] border border-glassEdge space-y-2 text-xs font-mono">
                <div className="flex justify-between text-moonMist">
                  <span>Product:</span>
                  <span className="text-pureWhite font-medium text-right max-w-[200px] truncate">
                    {selectedLoanForTracker.product.name}
                  </span>
                </div>
                <div className="flex justify-between text-moonMist">
                  <span>Provider:</span>
                  <span className="text-blueprintBlue">{selectedLoanForTracker.product.provider}</span>
                </div>
                <div className="flex justify-between text-moonMist">
                  <span>Estimated Monthly EMI:</span>
                  <span className="text-positiveMint font-medium tabular-nums">
                    ₹{selectedLoanForTracker.estimatedMonthlyEMI.toLocaleString("en-IN")} / mo
                  </span>
                </div>
                <div className="flex justify-between text-fogVeil">
                  <span>Tenure / Interest:</span>
                  <span>
                    {selectedLoanForTracker.product.tenureMonths} mos @ {selectedLoanForTracker.product.minInterestRate}%
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-fogVeil mb-1">
                  Monthly Payment Due Day (1 to 31) *
                </label>
                <input
                  type="number"
                  min={1}
                  max={31}
                  required
                  placeholder="5"
                  value={trackerDueDay}
                  onChange={(e) => setTrackerDueDay(e.target.value)}
                  className="input-frosted w-full px-3.5 py-2 text-sm"
                />
                <p className="text-[11px] text-fogVeil font-mono mt-1">
                  We'll track this on your Dashboard and alert you 3 days before it's due.
                </p>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedLoanForTracker(null)}
                  className="btn-pill w-1/2 text-xs py-2.5 cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={trackingSubmitting}
                  className="btn-void-violet w-1/2 text-xs py-2.5 cursor-pointer disabled:opacity-50"
                >
                  {trackingSubmitting ? "Linking..." : "Confirm & Track"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
