"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  calculateHealthScore,
  HealthScoreResult,
} from "@/lib/healthScore";
import {
  generateRecommendations,
  Recommendation,
} from "@/lib/recommendations";
import {
  Sparkles,
  TrendingUp,
  ShieldCheck,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  HelpCircle,
  RefreshCw,
  PlusCircle,
  Edit3,
  User,
  CheckCircle2,
  X,
  ArrowRight,
} from "lucide-react";
import { CountUp } from "@/components/motion/CountUp";
import { AnimatedProgress } from "@/components/motion/AnimatedProgress";
import EmiTrackerCard, { EmiEntry } from "@/components/EmiTrackerCard";

interface Transaction {
  id: string;
  type: "INCOME" | "EXPENSE";
  category: string;
  amount: number;
  isDiscretionary: boolean;
}

// AuthKit Restrained Frosted Palette for Categories
const CATEGORY_COLORS: Record<string, string> = {
  "Rent & Housing": "#b6d9fc",        // Blueprint Blue
  "Food & Groceries": "#9da7ba",      // Fog Veil
  "Discretionary / Outings": "#c7d3ea",// Moon Mist
  "Transport": "#8597b5",
  "Utilities & Wifi": "#5c6d8a",
  "Shopping & Subscriptions": "#3f4d66",
  "Healthcare": "#7287a3",
  "Education & Books": "#a8bdd9",
  "Other": "#2f343e",
};

// Custom AuthKit Frosted Tooltip for Recharts
const CustomChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const firstItem = payload[0];

    // 1. Hovering on Pie Chart Slice
    if (firstItem?.payload?.isPie) {
      const slice = firstItem.payload;
      return (
        <div className="glass-plate px-4 py-3 text-xs space-y-1.5 min-w-[200px] border border-glassEdge shadow-2xl">
          <div className="flex items-center space-x-2">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0 ring-1 ring-white/20"
              style={{ backgroundColor: slice.color || "#b6d9fc" }}
            />
            <span className="font-medium text-pureWhite tracking-tight">{slice.name}</span>
          </div>
          <div className="text-base font-medium text-frostGlow font-display">
            ₹{Number(slice.value || 0).toLocaleString("en-IN")}
          </div>
          {slice.percent && (
            <div className="text-[11px] text-fogVeil border-t border-glassEdge pt-1 flex items-center justify-between font-mono">
              <span>Share of Expenses:</span>
              <span className="font-medium text-frostGlow">{slice.percent}</span>
            </div>
          )}
        </div>
      );
    }

    // 2. Hovering on Bar Chart (Income, Expenses, Net Saved)
    const row = firstItem?.payload;
    const barName = row?.name || label || "Cashflow";
    const totalAmount = row?.total ?? firstItem?.value ?? 0;
    const breakdown: Array<{ name: string; amount: number; color: string; percent?: string }> =
      row?.breakdown || [];

    return (
      <div className="glass-plate px-4 py-3.5 text-xs space-y-2.5 min-w-[260px] max-w-[340px] border border-glassEdge shadow-2xl">
        <div className="flex items-center justify-between border-b border-glassEdge pb-2">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-pureWhite text-sm font-display">{barName}</span>
            <span className="badge-frost text-[10px]">
              Breakdown
            </span>
          </div>
          <span className="font-medium text-frostGlow text-sm font-mono">
            ₹{Number(totalAmount).toLocaleString("en-IN")}
          </span>
        </div>

        {breakdown.length > 0 ? (
          <div className="space-y-1.5 pt-0.5">
            <div className="text-[10px] uppercase font-mono text-fogVeil tracking-wider">
              Component Items:
            </div>
            {breakdown.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center space-x-2 truncate pr-2">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-moonMist truncate">{item.name}</span>
                </div>
                <div className="flex items-center space-x-1.5 flex-shrink-0 font-mono">
                  <span className="text-pureWhite">₹{item.amount.toLocaleString("en-IN")}</span>
                  {item.percent && (
                    <span className="text-[10px] text-fogVeil">({item.percent})</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-[11px] text-frostGlow font-mono">
            Total: ₹{Number(totalAmount).toLocaleString("en-IN")}
          </div>
        )}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [healthScore, setHealthScore] = useState<HealthScoreResult | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [emis, setEmis] = useState<EmiEntry[]>([]);
  const [gaugeRevealed, setGaugeRevealed] = useState(false);

  useEffect(() => {
    if (healthScore) {
      const timer = setTimeout(() => setGaugeRevealed(true), 120);
      return () => clearTimeout(timer);
    }
  }, [healthScore]);

  // Profile Edit modal
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editIncome, setEditIncome] = useState("");
  const [editAge, setEditAge] = useState("24");
  const [editObligations, setEditObligations] = useState("0");
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const userRes = await fetch("/api/user");
      const userData = await userRes.json();
      const currentUser = userData.user;
      setUser(currentUser);

      if (currentUser) {
        setEditName(currentUser.name || "");
        setEditIncome(currentUser.monthlyIncome ? currentUser.monthlyIncome.toString() : "");
        setEditAge(currentUser.age ? currentUser.age.toString() : "24");
        setEditObligations(currentUser.existingObligations ? currentUser.existingObligations.toString() : "0");
      }

      const txRes = await fetch("/api/transactions");
      const txData = await txRes.json();
      const txList: Transaction[] = txData.transactions || [];
      setTransactions(txList);

      const emisRes = await fetch("/api/emis");
      const emisData = await emisRes.json();
      const emisList: EmiEntry[] = emisData.emis || [];
      setEmis(emisList);

      const activeEmiTotal = emisList
        .filter((e) => e.status === "ACTIVE")
        .reduce((sum, e) => sum + e.monthlyInstallment, 0);

      const goalsRes = await fetch("/api/goals");
      const goalsData = await goalsRes.json();
      const goalsList = goalsData.goals || [];

      const emergencyGoals = goalsList.filter((g: any) =>
        g.category.toLowerCase().includes("emergency") ||
        g.name.toLowerCase().includes("emergency")
      );
      const emergencyFundSaved = emergencyGoals.reduce((sum: number, g: any) => sum + g.currentAmount, 0);

      const totalExpenses = txList
        .filter((t) => t.type === "EXPENSE")
        .reduce((sum, t) => sum + t.amount, 0);

      const userMonthlyInc = currentUser?.monthlyIncome || 0;
      const txIncome = txList
        .filter((t) => t.type === "INCOME")
        .reduce((sum, t) => sum + t.amount, 0);
      const totalIncome = txIncome > 0 ? txIncome : userMonthlyInc;

      const discretionaryExpenses = txList
        .filter((t) => t.type === "EXPENSE" && (t.isDiscretionary || t.category.toLowerCase().includes("discretionary") || t.category.toLowerCase().includes("shopping")))
        .reduce((sum, t) => sum + t.amount, 0);

      const totalExpensesWithEmis = totalExpenses + activeEmiTotal;
      const effectiveIncome = totalIncome;
      const effectiveSaved = Math.max(effectiveIncome - totalExpensesWithEmis, 0);

      const computedScore = calculateHealthScore({
        monthlyIncome: effectiveIncome,
        totalIncome: totalIncome,
        totalExpenses: totalExpensesWithEmis,
        discretionaryExpenses: discretionaryExpenses,
        totalSaved: effectiveSaved,
        emergencyFundSaved: emergencyFundSaved || 0,
      });

      setHealthScore(computedScore);

      const recs = generateRecommendations(
        computedScore,
        effectiveSaved
      );
      setRecommendations(recs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          monthlyIncome: Number(editIncome) || 0,
          age: Number(editAge) || 24,
          existingObligations: Number(editObligations) || 0,
        }),
      });
      if (res.ok) {
        setShowProfileModal(false);
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingProfile(false);
    }
  };

  const expenseCategories = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const uniqueExpenseCategories = Object.keys(expenseCategories);

  const txIncomeVal = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);
  const incomeVal = txIncomeVal > 0 ? txIncomeVal : (user?.monthlyIncome || 0);
  const totalExpenseVal = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);
  const rawNetSaved = incomeVal - totalExpenseVal;
  const isNetDeficit = rawNetSaved < 0;
  const netSavedVal = Math.abs(rawNetSaved);

  const pieData = Object.entries(expenseCategories).map(([name, value]) => ({
    name,
    value,
    color: CATEGORY_COLORS[name] || "#b6d9fc",
    isPie: true,
    percent: totalExpenseVal > 0 ? `${((value / totalExpenseVal) * 100).toFixed(1)}%` : "0%",
  }));

  const barData = [
    {
      name: "Income",
      total: incomeVal,
      "Take-Home Income": incomeVal,
      breakdown: [
        { name: txIncomeVal > 0 ? "Recorded Income" : "Take-Home Salary", amount: incomeVal, color: "#b6d9fc", percent: "100%" },
        ...(incomeVal > 0
          ? [
              {
                name: "Retained in Savings",
                amount: netSavedVal,
                color: "#34d399",
                percent: `${((netSavedVal / incomeVal) * 100).toFixed(1)}%`,
              },
              {
                name: "Consumed by Expenses",
                amount: totalExpenseVal,
                color: "#9da7ba",
                percent: `${((totalExpenseVal / incomeVal) * 100).toFixed(1)}%`,
              },
            ]
          : []),
      ],
    },
    {
      name: "Expenses",
      total: totalExpenseVal,
      ...expenseCategories,
      breakdown:
        uniqueExpenseCategories.length > 0
          ? uniqueExpenseCategories.map((cat) => ({
              name: cat,
              amount: expenseCategories[cat],
              color: CATEGORY_COLORS[cat] || "#9da7ba",
              percent:
                totalExpenseVal > 0
                  ? `${((expenseCategories[cat] / totalExpenseVal) * 100).toFixed(1)}%`
                  : "0%",
            }))
          : [{ name: "No expenses logged", amount: 0, color: "#9da7ba" }],
    },
    {
      name: "Net Saved",
      total: netSavedVal,
      "Monthly Surplus": netSavedVal,
      breakdown: [
        { name: "Net Monthly Surplus", amount: netSavedVal, color: "#34d399", percent: "100%" },
        ...(incomeVal > 0
          ? [
              {
                name: "Savings Rate",
                amount: netSavedVal,
                color: "#c7d3ea",
                percent: `${((netSavedVal / incomeVal) * 100).toFixed(1)}% of income`,
              },
            ]
          : []),
      ],
    },
  ];

  const scoreNum = healthScore ? (healthScore.overallScore ?? healthScore.totalScore ?? 0) : 0;

  if (loading && !healthScore) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <RefreshCw className="w-8 h-8 animate-spin text-frostGlow" />
        <p className="text-xs text-fogVeil font-mono">Calibrating financial engine...</p>
      </div>
    );
  }

  return (
    <div className="space-y-16 animate-fadeIn font-sans">
      {/* 1. Header Bar: Profile info and Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-fogVeil uppercase tracking-widest">
              Financial Engine
            </span>
            <span className="badge-frost text-[10px]">
              Live Engine
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-medium text-pureWhite mt-1">
            {user?.name || "Financial Profile"}
          </h1>
          <p className="text-xs text-moonMist mt-1">
            Real-time health score computed directly from your logged cashflow.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowProfileModal(true)}
            className="btn-pill inline-flex items-center space-x-2 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-fogVeil" />
            <span>Edit Profile</span>
          </button>
          <Link
            href="/tracker"
            className="btn-void-violet text-xs py-2 px-4 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Transaction</span>
          </Link>
        </div>
      </div>

      {/* Unconfigured Profile Banner if income is 0 */}
      {(!user?.monthlyIncome || user.monthlyIncome === 0) && (
        <div className="p-5 rounded-2xl glass-plate border border-glassEdge flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-glassEdge flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-frostGlow" />
            </div>
            <div>
              <div className="text-xs font-medium text-pureWhite">Set up your monthly income to get started</div>
              <div className="text-[11px] text-moonMist">Record your monthly take-home earnings so your live score and borrowing limits calibrate accurately.</div>
            </div>
          </div>
          <button
            onClick={() => setShowProfileModal(true)}
            className="btn-void-violet text-xs py-2 px-4 cursor-pointer self-start sm:self-auto"
          >
            Set Up Profile
          </button>
        </div>
      )}

      {/* Profile Setup Modal Via Portal */}
      {mounted && showProfileModal && createPortal(
        <div className="fixed inset-0 z-[9999] w-screen h-screen bg-[#05060f]/80 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg rounded-2xl glass-plate border border-glassEdge p-6 sm:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              type="button"
              onClick={() => setShowProfileModal(false)}
              className="absolute top-5 right-5 text-fogVeil hover:text-pureWhite p-1.5 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 pr-8">
              <div className="flex items-center space-x-2 text-frostGlow">
                <User className="w-4 h-4" />
                <span className="text-xs font-mono uppercase tracking-widest">Financial Inputs</span>
              </div>
              <h2 className="font-display text-xl font-medium text-pureWhite">
                Configure Financial Baseline
              </h2>
              <p className="text-xs text-moonMist">
                Enter your cashflow metrics to calibrate your Financial Health Score.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block text-fogVeil font-mono uppercase text-[11px] tracking-wider mb-1.5">
                  Display Label *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. My Profile, Alex"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="input-frosted w-full px-3.5 py-2.5"
                />
              </div>

              <div>
                <label className="block text-fogVeil font-mono uppercase text-[11px] tracking-wider mb-1.5">
                  Gross Monthly Take-Home Income (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="e.g. 50000"
                  value={editIncome}
                  onChange={(e) => setEditIncome(e.target.value)}
                  className="input-frosted w-full px-3.5 py-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-fogVeil font-mono uppercase text-[11px] tracking-wider mb-1.5">
                    Existing Monthly EMIs (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 0"
                    value={editObligations}
                    onChange={(e) => setEditObligations(e.target.value)}
                    className="input-frosted w-full px-3.5 py-2.5"
                  />
                </div>

                <div>
                  <label className="block text-fogVeil font-mono uppercase text-[11px] tracking-wider mb-1.5">
                    Age (Years)
                  </label>
                  <input
                    type="number"
                    min="16"
                    max="100"
                    placeholder="e.g. 24"
                    value={editAge}
                    onChange={(e) => setEditAge(e.target.value)}
                    className="input-frosted w-full px-3.5 py-2.5"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="btn-pill text-xs py-2 px-4 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="btn-void-violet text-xs py-2 px-5 cursor-pointer disabled:opacity-50"
                >
                  {savingProfile ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* 2. 4-Stat Overview Bar on Frosted Plates with Tabular Counting Numbers */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-plate p-5 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-fogVeil font-mono">
            <span>MONTHLY INCOME</span>
            <ArrowUpRight className="w-4 h-4 text-blueprintBlue" />
          </div>
          <div className="font-display text-2xl font-medium text-pureWhite tabular-nums">
            <CountUp end={incomeVal} prefix="₹" duration={1000} />
          </div>
          <div className="text-[11px] text-fogVeil font-mono">Take-Home Baseline</div>
        </div>

        <div className="glass-plate p-5 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-fogVeil font-mono">
            <span>TOTAL EXPENSES</span>
            <ArrowDownRight className="w-4 h-4 text-fogVeil" />
          </div>
          <div className="font-display text-2xl font-medium text-pureWhite tabular-nums">
            <CountUp end={totalExpenseVal} prefix="₹" duration={1000} />
          </div>
          <div className="text-[11px] text-fogVeil font-mono">
            {incomeVal > 0 ? `${((totalExpenseVal / incomeVal) * 100).toFixed(0)}% of income` : "0% logged"}
          </div>
        </div>

        <div className="glass-plate p-5 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-fogVeil font-mono">
            <span>{isNetDeficit ? "NET MONTHLY DEFICIT" : "NET MONTHLY SAVED"}</span>
            {isNetDeficit ? (
              <ArrowDownRight className="w-4 h-4 text-negativeCoral" />
            ) : (
              <TrendingUp className="w-4 h-4 text-positiveMint" />
            )}
          </div>
          <div
            className={`font-display text-2xl font-medium tabular-nums ${
              isNetDeficit ? "text-negativeCoral" : "text-positiveMint"
            }`}
          >
            <CountUp end={netSavedVal} prefix={isNetDeficit ? "-₹" : "₹"} duration={1100} />
          </div>
          <div
            className={`text-[11px] font-mono ${
              isNetDeficit ? "text-negativeCoral/90" : "text-positiveMint/90"
            }`}
          >
            {isNetDeficit
              ? `${incomeVal > 0 ? ((totalExpenseVal / incomeVal) * 100).toFixed(0) : "100"}% expense ratio`
              : incomeVal > 0
              ? `${((netSavedVal / incomeVal) * 100).toFixed(1)}% savings rate`
              : "No income"}
          </div>
        </div>

        <div className="glass-plate p-5 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-fogVeil font-mono">
            <span>HEALTH SCORE</span>
            <ShieldCheck className="w-4 h-4 text-frostGlow" />
          </div>
          <div className="font-display text-2xl font-medium text-frostGlow tabular-nums">
            <CountUp end={Number(scoreNum) || 0} duration={1200} /><span className="text-sm font-normal text-fogVeil">/100</span>
          </div>
          <div className="text-[11px] text-frostGlow font-medium">{healthScore?.statusLabel}</div>
        </div>
      </div>

      {/* 3. HEALTH SCORE SECTION: Dial + Plain English Factors */}
      <div className="space-y-6">
        <div className="eyebrow-divider">
          <span>YOUR FINANCIAL HEALTH ENGINE</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Col: Frosted Health Score Gauge with Signature Synchronized Sweep & Count */}
          <div className="glass-plate p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[11px] font-mono uppercase tracking-widest text-fogVeil">
                CORE COMPOSITE SIGNAL
              </span>
              <h2 className="font-display text-xl font-medium text-pureWhite">Financial Health Score</h2>
              <p className="text-xs text-moonMist">
                Computed in real-time across four weighted financial factors.
              </p>
            </div>

            {/* SVG Score Gauge Dial */}
            <div className="flex flex-col items-center justify-center my-3 relative">
              <div className="w-48 h-48 rounded-full border border-glassEdge flex items-center justify-center relative shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_16px_32px_rgba(0,0,0,0.6)]">
                <svg className="w-full h-full transform -rotate-90 absolute top-0 left-0" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="rgba(186, 215, 247, 0.08)"
                    strokeWidth="7"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="#b6d9fc"
                    strokeWidth="7"
                    fill="transparent"
                    strokeDasharray="263.89"
                    strokeDashoffset={
                      gaugeRevealed
                        ? 263.89 - (263.89 * Math.min(Math.max(Number(scoreNum) || 0, 0), 100)) / 100
                        : 263.89
                    }
                    strokeLinecap="round"
                    style={{
                      transition: "stroke-dashoffset 1200ms cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  />
                </svg>

                <div className="text-center z-10 space-y-0.5">
                  <div className="font-display text-5xl font-medium text-ice-highlight tabular-nums">
                    <CountUp end={Number(scoreNum) || 0} duration={1200} />
                  </div>
                  <div className="text-[10px] text-fogVeil uppercase tracking-widest font-mono">OUT OF 100</div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-4 badge-frost text-xs py-1 px-3">
                {healthScore?.statusLabel}
              </div>
            </div>

            {/* What this means box */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-glassEdge text-xs space-y-2">
              <div className="flex items-center space-x-2 text-frostGlow font-medium">
                <Sparkles className="w-3.5 h-3.5 text-blueprintBlue" />
                <span>Executive Summary:</span>
              </div>
              <p className="text-moonMist leading-relaxed">
                {healthScore?.summaryText}
              </p>
            </div>
          </div>

          {/* Right 2 Cols: 4 Plain-English Factor Breakdown Cards */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-medium text-pureWhite">
                Constituent Factor Metrics
              </h2>
              <Link
                href="/literacy?module=emergency-fund-basics"
                className="text-xs text-moonMist hover:text-pureWhite flex items-center space-x-1.5 transition-colors font-mono"
              >
                <span>Scoring criteria</span>
                <HelpCircle className="w-3.5 h-3.5 text-fogVeil" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Savings Rate Card */}
              <div className="glass-plate p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-pureWhite">Savings Rate (40% Weight)</span>
                  <span className="badge-frost text-[10px]">
                    {healthScore?.components.savingsRate.metricValue}
                  </span>
                </div>
                <p className="text-xs text-moonMist leading-relaxed">
                  {healthScore?.components.savingsRate.description}
                </p>
                <AnimatedProgress
                  value={healthScore?.components.savingsRate.score || 0}
                  heightClass="h-1.5"
                  barColor="bg-positiveMint"
                  useSweep={false}
                />
              </div>

              {/* Expense-to-Income Card */}
              <div className="glass-plate p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-pureWhite">Expense Ratio (25% Weight)</span>
                  <span className="badge-frost text-[10px]">
                    {healthScore?.components.expenseRatio.metricValue}
                  </span>
                </div>
                <p className="text-xs text-moonMist leading-relaxed">
                  {healthScore?.components.expenseRatio.description}
                </p>
                <AnimatedProgress
                  value={healthScore?.components.expenseRatio.score || 0}
                  heightClass="h-1.5"
                  barColor="bg-blueprintBlue"
                  useSweep={false}
                />
              </div>

              {/* Discretionary Spend Card */}
              <div className="glass-plate p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-medium text-pureWhite">Discretionary (20% Weight)</span>
                    <Link href="/literacy?module=50-30-20-rule" title="Contextual Card">
                      <HelpCircle className="w-3.5 h-3.5 text-fogVeil hover:text-pureWhite transition-colors" />
                    </Link>
                  </div>
                  <span className="badge-frost text-[10px]">
                    {healthScore?.components.discretionaryRatio.metricValue}
                  </span>
                </div>
                <p className="text-xs text-moonMist leading-relaxed">
                  {healthScore?.components.discretionaryRatio.description}
                </p>
                <AnimatedProgress
                  value={healthScore?.components.discretionaryRatio.score || 0}
                  heightClass="h-1.5"
                  barColor="bg-moonMist"
                  useSweep={false}
                />
              </div>

              {/* Emergency Fund Card */}
              <div className="glass-plate p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-medium text-pureWhite">Emergency Buffer (15% Weight)</span>
                    <Link href="/literacy?module=emergency-fund-basics" title="Contextual Card">
                      <HelpCircle className="w-3.5 h-3.5 text-fogVeil hover:text-pureWhite transition-colors" />
                    </Link>
                  </div>
                  <span className="badge-frost text-[10px]">
                    {healthScore?.components.emergencyCoverage.metricValue}
                  </span>
                </div>
                <p className="text-xs text-moonMist leading-relaxed">
                  {healthScore?.components.emergencyCoverage.description}
                </p>
                <AnimatedProgress
                  value={healthScore?.components.emergencyCoverage.score || 0}
                  heightClass="h-1.5"
                  barColor="bg-frostGlow"
                  useSweep={false}
                />
              </div>
            </div>

            {/* Plain English Insights Box */}
            <div className="glass-plate p-5 space-y-2.5">
              <h3 className="text-xs font-mono text-fogVeil uppercase tracking-wider">
                Observable Signals:
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-moonMist">
                {healthScore?.plainEnglishInsights.map((insight, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-blueprintBlue mt-0.5">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 3.5 OBLIGATIONS & DUE DATES SECTION */}
      <div className="space-y-6">
        <div className="eyebrow-divider">
          <span>DEBT OBLIGATIONS & DUE DATES</span>
        </div>
        <EmiTrackerCard
          initialEmis={emis}
          onEmisChange={(updated) => {
            setEmis(updated);
            fetchDashboardData();
          }}
        />
      </div>

      {/* 4. CASHFLOW CHARTS SECTION */}
      <div className="space-y-6">
        <div className="eyebrow-divider">
          <span>CASHFLOW ALLOCATION & RATIOS</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart: Expense Breakdown */}
          <div className="glass-plate p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-medium text-pureWhite">Expense Distribution</h3>
                <p className="text-xs text-fogVeil">Categorized monthly outflows</p>
              </div>
              <PieChart className="w-4 h-4 text-blueprintBlue" />
            </div>

            {pieData.length === 0 ? (
              <div className="h-64 min-h-[250px] flex flex-col items-center justify-center space-y-2 border border-dashed border-glassEdge rounded-xl">
                <PlusCircle className="w-5 h-5 text-fogVeil" />
                <p className="text-xs text-fogVeil">No expenses logged yet.</p>
                <Link href="/tracker" className="text-xs text-frostGlow underline">Add first expense</Link>
              </div>
            ) : (
              <div className="h-64 min-h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="#05060f" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomChartTooltip />} />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
            )}

            {pieData.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-3 border-t border-glassEdge text-xs">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-fogVeil truncate font-mono text-[11px]">{item.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bar Chart: Cashflow Stack */}
          <div className="glass-plate p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-medium text-pureWhite">Cashflow Comparison</h3>
                <p className="text-xs text-fogVeil">Income, categorized expenses, and surplus</p>
              </div>
              <TrendingUp className="w-4 h-4 text-positiveMint" />
            </div>

            <div className="h-64 min-h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(186, 215, 247, 0.05)" />
                  <XAxis dataKey="name" stroke="#9da7ba" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#9da7ba" tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip
                    content={<CustomChartTooltip />}
                    cursor={{ fill: "rgba(186, 215, 247, 0.05)" }}
                  />
                  <Bar
                    dataKey="Take-Home Income"
                    stackId="cashflow"
                    fill="#b6d9fc"
                    radius={[6, 6, 0, 0]}
                  />
                  {uniqueExpenseCategories.map((cat, idx) => (
                    <Bar
                      key={cat}
                      dataKey={cat}
                      stackId="cashflow"
                      fill={CATEGORY_COLORS[cat] || "#9da7ba"}
                      radius={idx === uniqueExpenseCategories.length - 1 ? [6, 6, 0, 0] : [0, 0, 0, 0]}
                    />
                  ))}
                  {uniqueExpenseCategories.length === 0 && (
                    <Bar
                      dataKey="Expenses"
                      stackId="cashflow"
                      fill="#9da7ba"
                      radius={[6, 6, 0, 0]}
                    />
                  )}
                  <Bar
                    dataKey="Monthly Surplus"
                    stackId="cashflow"
                    fill="#34d399"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="p-3 rounded-md bg-white/[0.03] border border-glassEdge text-xs text-fogVeil flex items-center justify-between font-mono">
              <span>Net Monthly Surplus:</span>
              <span className="font-display font-medium text-positiveMint text-sm">
                ₹{netSavedVal.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. PERSONALIZED GUIDANCE SECTION */}
      <div className="space-y-6">
        <div className="eyebrow-divider">
          <span>RECOMMENDED ACTIONS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="glass-plate glass-plate-hover p-6 sm:p-7 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="badge-frost text-[10px]">
                    {rec.category}
                  </span>
                  {rec.priority === "high" && (
                    <span className="text-[10px] text-positiveMint font-mono uppercase tracking-wider">
                      Priority Step
                    </span>
                  )}
                </div>
                <h3 className="font-display text-base font-medium text-pureWhite">{rec.title}</h3>
                <p className="text-xs text-moonMist leading-relaxed">{rec.description}</p>
              </div>

              <Link
                href={rec.actionHref}
                className="btn-pill w-full text-center flex items-center justify-center space-x-1.5 text-xs cursor-pointer hover:border-frostGlow/30"
              >
                <span>{rec.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5 text-fogVeil" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
