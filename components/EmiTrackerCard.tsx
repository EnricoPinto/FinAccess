"use client";

import { useState, useEffect } from "react";
import {
  CreditCard,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Trash2,
  Clock,
  Landmark,
  X,
} from "lucide-react";
import CountUp from "@/components/motion/CountUp";

export interface EmiEntry {
  id: string;
  userId: string;
  name: string;
  type: "LOAN" | "CREDIT_CARD";
  principalAmount?: number | null;
  interestRate?: number | null;
  tenureMonths?: number | null;
  monthlyInstallment: number;
  dueDay: number; // 1 to 31
  startDate: string;
  status: "ACTIVE" | "PAID_OFF";
  linkedLoanProductId?: string | null;
  createdAt: string;
}

interface EmiTrackerCardProps {
  initialEmis?: EmiEntry[];
  onEmisChange?: (emis: EmiEntry[]) => void;
}

export function getUpcomingDueDate(dueDay: number) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDate = now.getDate();

  // Due date in current month
  let nextDue = new Date(currentYear, currentMonth, dueDay, 23, 59, 59);
  if (dueDay < currentDate) {
    nextDue = new Date(currentYear, currentMonth + 1, dueDay, 23, 59, 59);
  }

  const diffTime = nextDue.getTime() - now.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return {
    date: nextDue,
    daysRemaining,
    formattedDate: nextDue.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    }),
  };
}

export default function EmiTrackerCard({ initialEmis, onEmisChange }: EmiTrackerCardProps) {
  const [emis, setEmis] = useState<EmiEntry[]>(initialEmis || []);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Add Form State
  const [name, setName] = useState("");
  const [type, setType] = useState<"LOAN" | "CREDIT_CARD">("LOAN");
  const [monthlyInstallment, setMonthlyInstallment] = useState("");
  const [dueDay, setDueDay] = useState("5");
  const [submitting, setSubmitting] = useState(false);

  const fetchEmis = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/emis");
      const data = await res.json();
      if (data.emis) {
        setEmis(data.emis);
        if (onEmisChange) onEmisChange(data.emis);
      }
    } catch (err) {
      console.error("Failed to fetch EMIs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialEmis) {
      fetchEmis();
    }
  }, []);

  const activeEmis = emis
    .filter((e) => e.status === "ACTIVE")
    .map((e) => ({
      ...e,
      dueInfo: getUpcomingDueDate(e.dueDay),
    }))
    .sort((a, b) => a.dueInfo.daysRemaining - b.dueInfo.daysRemaining);

  const totalActiveMonthlyEmi = activeEmis.reduce(
    (sum, e) => sum + e.monthlyInstallment,
    0
  );

  const handleCreateEmi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !monthlyInstallment || !dueDay) return;

    try {
      setSubmitting(true);
      const res = await fetch("/api/emis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          type,
          monthlyInstallment: parseFloat(monthlyInstallment),
          dueDay: parseInt(dueDay, 10),
        }),
      });

      if (res.ok) {
        setName("");
        setMonthlyInstallment("");
        setDueDay("5");
        setShowAddModal(false);
        fetchEmis();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: "ACTIVE" | "PAID_OFF") => {
    const nextStatus = currentStatus === "ACTIVE" ? "PAID_OFF" : "ACTIVE";
    try {
      const res = await fetch("/api/emis", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      if (res.ok) {
        fetchEmis();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEmi = async (id: string) => {
    if (typeof window !== "undefined" && !window.confirm("Remove this payment obligation?")) {
      return;
    }
    try {
      const res = await fetch(`/api/emis?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchEmis();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="glass-plate p-6 space-y-5 relative card-tactile">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-glassEdge pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-voidViolet/10 border border-voidViolet/30 flex items-center justify-center text-frostGlow">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display text-base font-medium text-pureWhite flex items-center space-x-2">
              <span>Upcoming Due Dates & EMIs</span>
              <span className="badge-frost text-[9px] py-0.5 font-mono">
                {activeEmis.length} Active
              </span>
            </h3>
            <p className="text-[11px] text-fogVeil">Never miss credit card or loan repayments</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-mono text-frostGlow bg-white/[0.04] hover:bg-white/[0.08] border border-glassEdge transition-all cursor-pointer card-tactile"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Obligation</span>
        </button>
      </div>

      {/* Monthly Total Obligation */}
      <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-glassEdge font-mono">
        <div>
          <span className="text-[11px] text-fogVeil">TOTAL MONTHLY OBLIGATION</span>
          <div className="text-xl font-medium text-pureWhite tabular-nums">
            <CountUp value={totalActiveMonthlyEmi} prefix="₹" isCurrency />
            <span className="text-xs text-fogVeil font-normal"> / mo</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-fogVeil">DTI IMPACT</span>
          <div className="text-xs text-frostGlow font-medium">Included in Health Score</div>
        </div>
      </div>

      {/* Upcoming List */}
      {loading && activeEmis.length === 0 ? (
        <p className="text-xs text-fogVeil text-center py-6 font-mono">Loading payment obligations...</p>
      ) : activeEmis.length === 0 ? (
        <div className="text-center py-8 space-y-2">
          <CheckCircle2 className="w-7 h-7 text-positiveMint/70 mx-auto" />
          <p className="text-xs text-fogVeil font-mono">No active loan or credit card dues tracked.</p>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="text-[11px] font-mono text-blueprintBlue hover:underline cursor-pointer"
          >
            + Track your first EMI or card bill
          </button>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {activeEmis.map((emi) => {
            const isUrgent = emi.dueInfo.daysRemaining <= 3 && emi.dueInfo.daysRemaining >= 0;
            return (
              <div
                key={emi.id}
                className={`p-3 rounded-xl border transition-all duration-200 flex items-center justify-between card-tactile ${
                  isUrgent
                    ? "bg-negativeCoral/[0.04] border-negativeCoral/40 shadow-[0_0_12px_rgba(255,99,99,0.08)]"
                    : "bg-white/[0.02] border-glassEdge hover:border-frostGlow/30"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                      emi.type === "CREDIT_CARD"
                        ? "bg-blueprintBlue/10 text-blueprintBlue border-blueprintBlue/20"
                        : "bg-voidViolet/10 text-frostGlow border-voidViolet/20"
                    }`}
                  >
                    {emi.type === "CREDIT_CARD" ? (
                      <CreditCard className="w-4 h-4" />
                    ) : (
                      <Landmark className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-medium text-pureWhite">{emi.name}</span>
                      <span className="text-[9px] font-mono text-fogVeil uppercase px-1 py-0.2 rounded bg-white/[0.04]">
                        {emi.type === "CREDIT_CARD" ? "Card" : "EMI"}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 mt-0.5 text-[11px] font-mono">
                      <span className="flex items-center space-x-1 text-fogVeil">
                        <Calendar className="w-3 h-3" />
                        <span>Due {emi.dueInfo.formattedDate}</span>
                      </span>
                      <span>•</span>
                      {isUrgent ? (
                        <span className="text-negativeCoral font-medium flex items-center space-x-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>
                            {emi.dueInfo.daysRemaining === 0
                              ? "Due today!"
                              : `Due in ${emi.dueInfo.daysRemaining} day${emi.dueInfo.daysRemaining > 1 ? "s" : ""}!`}
                          </span>
                        </span>
                      ) : (
                        <span className="text-fogVeil">
                          in {emi.dueInfo.daysRemaining} days
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right font-mono">
                    <div className="text-sm font-medium text-pureWhite tabular-nums">
                      ₹{emi.monthlyInstallment.toLocaleString("en-IN")}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(emi.id, emi.status)}
                      className="text-[10px] text-positiveMint hover:underline cursor-pointer"
                    >
                      Mark Paid
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteEmi(emi.id)}
                    className="p-1.5 text-fogVeil hover:text-negativeCoral transition-colors cursor-pointer"
                    title="Remove from tracker"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Obligation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[250] bg-[#05060f]/80 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn">
          <div className="glass-plate max-w-md w-full p-6 space-y-5 border border-glassEdge shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-glassEdge pb-3">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-frostGlow" />
                <h3 className="font-display text-lg font-medium text-pureWhite">
                  Track Credit Card or Loan EMI
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-fogVeil hover:text-pureWhite transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEmi} className="space-y-4">
              {/* Type toggle */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-white/[0.03] rounded-md border border-glassEdge">
                <button
                  type="button"
                  onClick={() => setType("LOAN")}
                  className={`py-1.5 rounded-md text-xs font-mono font-medium transition-all cursor-pointer ${
                    type === "LOAN"
                      ? "bg-white/[0.12] text-pureWhite border border-frostGlow/40"
                      : "text-fogVeil hover:text-pureWhite"
                  }`}
                >
                  Loan EMI
                </button>
                <button
                  type="button"
                  onClick={() => setType("CREDIT_CARD")}
                  className={`py-1.5 rounded-md text-xs font-mono font-medium transition-all cursor-pointer ${
                    type === "CREDIT_CARD"
                      ? "bg-white/[0.12] text-pureWhite border border-frostGlow/40"
                      : "text-fogVeil hover:text-pureWhite"
                  }`}
                >
                  Credit Card Bill
                </button>
              </div>

              {/* Obligation Name */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-fogVeil mb-1">
                  Obligation Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HDFC Personal Loan, Amazon Pay ICICI"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-frosted w-full px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Monthly Amount */}
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-fogVeil mb-1">
                    Monthly Bill / EMI (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 4500"
                    value={monthlyInstallment}
                    onChange={(e) => setMonthlyInstallment(e.target.value)}
                    className="input-frosted w-full px-3 py-2 text-sm"
                  />
                </div>

                {/* Due Day */}
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-fogVeil mb-1">
                    Monthly Due Day (1-31) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    required
                    placeholder="5"
                    value={dueDay}
                    onChange={(e) => setDueDay(e.target.value)}
                    className="input-frosted w-full px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-pill w-1/2 text-xs py-2.5 cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-void-violet w-1/2 text-xs py-2.5 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Start Tracking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
