"use client";

import { useEffect, useState } from "react";
import {
  Target,
  PlusCircle,
  Clock,
  Sparkles,
  Sliders,
  Trash2,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import CountUp from "@/components/motion/CountUp";
import AnimatedProgress from "@/components/motion/AnimatedProgress";

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
  category: string;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [extraSavingsAmount, setExtraSavingsAmount] = useState<number>(2500);

  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [monthlyContribution, setMonthlyContribution] = useState("3000");
  const [category, setCategory] = useState("Emergency Fund");
  const [submitting, setSubmitting] = useState(false);
  const [goalError, setGoalError] = useState("");

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/goals");
      const data = await res.json();
      setGoals(data.goals || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    setGoalError("");
    const parsedTarget = Number(targetAmount);
    if (!name.trim()) {
      setGoalError("Please enter a valid goal name.");
      return;
    }
    if (isNaN(parsedTarget) || parsedTarget <= 0) {
      setGoalError("Target amount must be a positive number.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          targetAmount: parsedTarget,
          currentAmount: Math.max(Number(currentAmount) || 0, 0),
          monthlyContribution: isNaN(Number(monthlyContribution)) ? 2500 : Math.max(Number(monthlyContribution), 0),
          category,
        }),
      });

      if (res.ok) {
        setName("");
        setTargetAmount("");
        setCurrentAmount("");
        fetchGoals();
      } else {
        const data = await res.json();
        setGoalError(data.error || "Failed to create goal.");
      }
    } catch (err) {
      console.error(err);
      setGoalError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    if (typeof window !== "undefined" && !window.confirm("Are you sure you want to delete this goal?")) {
      return;
    }
    try {
      const res = await fetch(`/api/goals?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setGoals((prev) => prev.filter((g) => g.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const calculateMonthsLeft = (current: number, target: number, monthly: number) => {
    const remaining = Math.max((target || 0) - (current || 0), 0);
    if (remaining === 0) return 0;
    if (monthly <= 0) return null;
    return Math.ceil(remaining / monthly);
  };

  return (
    <div className="space-y-14 animate-fadeIn font-sans">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-fogVeil uppercase tracking-widest">
            Savings & Goal Simulator
          </span>
          <span className="badge-frost text-[10px]">What-If Engine</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-medium text-pureWhite mt-1">
          Financial Goals & Timeline Simulator
        </h1>
        <p className="text-xs text-moonMist mt-1">
          Calibrate achievable targets and explore how custom monthly adjustments accelerate your progress.
        </p>
      </div>

      {/* INTERACTIVE "WHAT-IF" SIMULATOR SECTION on Frosted Plate */}
      <div className="glass-plate p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="badge-frost text-xs inline-flex items-center space-x-1.5 py-1 px-3">
              <Sliders className="w-3.5 h-3.5" />
              <span>Interactive Timeline Calibration</span>
            </div>
            <h2 className="font-display text-xl font-medium text-pureWhite">
              What Happens If You Save <span className="text-ice-highlight">+₹{extraSavingsAmount.toLocaleString("en-IN")}</span> Extra Each Month?
            </h2>
          </div>

          <Link
            href="/literacy?module=emergency-fund-basics"
            className="text-xs text-fogVeil hover:text-pureWhite flex items-center space-x-1.5 transition-colors font-mono"
          >
            <span>Emergency goal hierarchy</span>
            <HelpCircle className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Custom Boost Amount Input & Preset Chips */}
        <div className="space-y-4 max-w-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-fogVeil font-medium text-xs font-mono">
                +₹
              </span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Enter custom boost amount (e.g. 10000)"
                value={extraSavingsAmount || ""}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, "");
                  setExtraSavingsAmount(val ? parseInt(val, 10) : 0);
                }}
                className="input-frosted w-full pl-9 pr-4 py-2.5 text-xs font-medium font-mono text-frostGlow"
              />
            </div>
            <span className="text-xs text-fogVeil font-mono">Extra savings per month</span>
          </div>

          {/* Quick Preset Buttons: 999px Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] text-fogVeil font-mono mr-1">Quick Presets:</span>
            {[500, 1000, 2500, 5000, 10000, 25000, 50000].map((preset) => {
              const isActive = extraSavingsAmount === preset;
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setExtraSavingsAmount(preset)}
                  className={`tab-pill py-1 px-3 text-xs font-mono ${
                    isActive ? "tab-pill-active" : "border border-glassEdge"
                  }`}
                >
                  <span className="relative z-10 flex items-center space-x-1">
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blueprintBlue animate-pulse shadow-[0_0_8px_#b6d9fc]" />
                    )}
                    <span>+₹{preset >= 1000 ? `${(preset / 1000).toLocaleString("en-IN")}k` : preset}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Comparison Cards based on active goals */}
        {goals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-glassEdge">
            {goals.map((goal) => {
              const currentMonths = calculateMonthsLeft(
                goal.currentAmount,
                goal.targetAmount,
                goal.monthlyContribution
              );
              const boostedMonths = calculateMonthsLeft(
                goal.currentAmount,
                goal.targetAmount,
                goal.monthlyContribution + extraSavingsAmount
              );
              const monthsSaved =
                currentMonths !== null && boostedMonths !== null
                  ? Math.max(currentMonths - boostedMonths, 0)
                  : 0;

              return (
                <div
                  key={goal.id}
                  className={`p-4 rounded-xl bg-white/[0.02] border transition-all duration-300 card-tactile space-y-2.5 text-xs ${
                    monthsSaved > 0
                      ? "border-positiveMint/30 glow-mint-calm bg-positiveMint/[0.02]"
                      : "border-glassEdge"
                  }`}
                >
                  <div className="flex justify-between font-medium text-pureWhite">
                    <span>{goal.name}</span>
                    <span className="text-frostGlow font-mono tabular-nums">₹{goal.targetAmount.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="flex items-center justify-between text-fogVeil font-mono">
                    <span>Current Pace (₹{goal.monthlyContribution.toLocaleString("en-IN")}/mo):</span>
                    <span className="tabular-nums">{currentMonths !== null ? `${currentMonths} months` : "Paused"}</span>
                  </div>

                  <div className="flex items-center justify-between text-frostGlow font-medium font-mono">
                    <span>With +₹{extraSavingsAmount.toLocaleString("en-IN")} Boost:</span>
                    <span className="tabular-nums">{boostedMonths !== null ? `${boostedMonths} months` : "Paused"}</span>
                  </div>

                  {currentMonths === null && boostedMonths !== null && extraSavingsAmount > 0 && (
                    <div className="pt-1 text-[11px] text-positiveMint font-medium flex items-center space-x-1.5 font-mono">
                      <Sparkles className="w-3.5 h-3.5 text-positiveMint flex-shrink-0" />
                      <span>Boost activates this goal! Achieved in {boostedMonths} months.</span>
                    </div>
                  )}

                  {currentMonths !== null && monthsSaved > 0 && (
                    <div className="pt-1 text-[11px] text-positiveMint font-medium flex items-center space-x-1.5 font-mono">
                      <Sparkles className="w-3.5 h-3.5 text-positiveMint flex-shrink-0" />
                      <span>You hit this goal {monthsSaved} month{monthsSaved > 1 ? "s" : ""} sooner!</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-5 rounded-xl bg-white/[0.02] border border-glassEdge text-xs text-fogVeil text-center font-mono">
            Create an active goal below to calculate instant timeline savings with your custom monthly boost!
          </div>
        )}
      </div>

      {/* Main Grid: Create Goal Form & Active Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Goal Form (1 Col) */}
        <div className="glass-plate p-6 space-y-5 h-fit">
          <div className="flex items-center space-x-2">
            <PlusCircle className="w-4 h-4 text-frostGlow" />
            <h2 className="font-display text-lg font-medium text-pureWhite">Set a New Goal</h2>
          </div>

          <form onSubmit={handleCreateGoal} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-fogVeil mb-1.5">
                Goal Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Emergency Shield, Work Laptop"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-frosted w-full px-3.5 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-fogVeil mb-1.5">
                Target Amount (₹) *
              </label>
              <input
                type="number"
                required
                placeholder="e.g. 30000"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="input-frosted w-full px-3.5 py-2.5 text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-fogVeil mb-1.5">
                Current Saved Amount (₹)
              </label>
              <input
                type="number"
                placeholder="e.g. 12000"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                className="input-frosted w-full px-3.5 py-2.5 text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-fogVeil mb-1.5">
                Monthly Planned Contribution (₹)
              </label>
              <input
                type="number"
                placeholder="e.g. 3000"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
                className="input-frosted w-full px-3.5 py-2.5 text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-fogVeil mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-frosted w-full px-3.5 py-2.5 text-sm bg-[#05060f]"
              >
                <option value="Emergency Fund">Emergency Fund</option>
                <option value="Gadget / Gear">Gadget / Tech</option>
                <option value="Education">Education & Courses</option>
                <option value="Travel / Lifestyle">Travel & Lifestyle</option>
                <option value="General">General Savings</option>
              </select>
            </div>

            {goalError && (
              <div className="p-2.5 rounded-md bg-negativeCoral/10 border border-negativeCoral/30 text-negativeCoral text-[11px] font-mono">
                {goalError}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-void-violet w-full text-xs py-2.5 cursor-pointer disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Create Goal"}
            </button>
          </form>
        </div>

        {/* Active Goals List (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-display text-lg font-medium text-pureWhite">Active Targets</h2>

          {loading ? (
            <p className="text-xs text-fogVeil font-mono">Loading goals...</p>
          ) : goals.length === 0 ? (
            <div className="glass-plate p-10 text-center space-y-2">
              <Target className="w-8 h-8 text-fogVeil/40 mx-auto" />
              <p className="text-xs text-fogVeil font-mono">No active goals yet. Create your first goal on the left.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goals.map((g) => {
                const percent = Math.min(
                  Math.round((g.currentAmount / Math.max(g.targetAmount, 1)) * 100),
                  100
                );
                const months = calculateMonthsLeft(
                  g.currentAmount,
                  g.targetAmount,
                  g.monthlyContribution
                );

                return (
                  <div
                    key={g.id}
                    className={`glass-plate glass-plate-hover card-tactile p-6 flex flex-col justify-between space-y-4 transition-all duration-300 ${
                      percent >= 100 ? "border-positiveMint/40 glow-mint-calm" : ""
                    }`}
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="badge-frost text-[10px]">
                          {g.category}
                        </span>

                        <button
                          onClick={() => handleDeleteGoal(g.id)}
                          className="text-fogVeil hover:text-negativeCoral transition-colors p-1 cursor-pointer"
                          title="Delete goal"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h3 className="font-display text-base font-medium text-pureWhite">{g.name}</h3>

                      <div className="flex justify-between items-baseline pt-1">
                        <CountUp
                          value={g.currentAmount}
                          prefix="₹"
                          isCurrency
                          className="font-display text-lg font-medium text-frostGlow font-mono tabular-nums"
                        />
                        <span className="text-xs text-fogVeil font-mono tabular-nums">
                          Target: ₹{g.targetAmount.toLocaleString("en-IN")}
                        </span>
                      </div>

                      {/* Smooth Viewport Animated Progress Bar with subtle sweep */}
                      <AnimatedProgress value={percent} heightClass="h-1.5" useSweep={percent > 0} />
                      <div className="flex items-center justify-between text-[11px] text-fogVeil font-mono">
                        <span>Pace</span>
                        <span className="tabular-nums">{percent}% achieved</span>
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-glassEdge flex items-center justify-between text-xs text-fogVeil font-mono">
                      <span className="flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 text-blueprintBlue" />
                        <span>
                          {months === 0
                            ? "Goal Achieved!"
                            : months === null
                            ? "Contributions Paused"
                            : `~${months} months left`}
                        </span>
                      </span>
                      <span>₹{g.monthlyContribution}/mo</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
