"use client";

import { useEffect, useState } from "react";
import {
  Receipt,
  PlusCircle,
  Trash2,
  Pencil,
  X,
  TrendingUp,
  TrendingDown,
  Filter,
  DollarSign,
  Tag,
  Calendar,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Camera,
} from "lucide-react";
import Link from "next/link";
import CountUp from "@/components/motion/CountUp";
import ScreenshotUpload, { ParsedReceipt } from "@/components/ScreenshotUpload";

interface Transaction {
  id: string;
  type: "INCOME" | "EXPENSE";
  category: string;
  amount: number;
  description?: string;
  isDiscretionary: boolean;
  date: string;
  source?: string;
  ocrConfidence?: string;
  rawOcrText?: string;
}

export default function TrackerPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("ALL");

  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [category, setCategory] = useState("Discretionary / Outings");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isDiscretionary, setIsDiscretionary] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userIncome, setUserIncome] = useState(0);

  // OCR Scan State
  const [showScanModal, setShowScanModal] = useState(false);
  const [scanConfidence, setScanConfidence] = useState<string | null>(null);
  const [rawOcrText, setRawOcrText] = useState<string | null>(null);

  // Edit Transaction State
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [editType, setEditType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [editCategory, setEditCategory] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editIsDiscretionary, setEditIsDiscretionary] = useState(true);
  const [editSubmitting, setEditSubmitting] = useState(false);

  const categories =
    type === "EXPENSE"
      ? [
          "Discretionary / Outings",
          "Rent & Housing",
          "Food & Groceries",
          "Transport",
          "Utilities & Wifi",
          "Shopping & Subscriptions",
          "Healthcare",
          "Education & Books",
          "Other Expense",
        ]
      : ["Salary / Stipend", "Freelance / Projects", "Investments", "Gifts", "Other Income"];

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/transactions");
      const data = await res.json();
      setTransactions(data.transactions || []);

      const userRes = await fetch("/api/user");
      const userData = await userRes.json();
      if (typeof userData.user?.monthlyIncome === "number") {
        setUserIncome(userData.user.monthlyIncome);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    if (type === "EXPENSE") {
      if (!categories.includes(category)) {
        setCategory("Discretionary / Outings");
        setIsDiscretionary(true);
      } else {
        const catLower = category.toLowerCase();
        if (catLower.includes("discretionary") || catLower.includes("shopping")) {
          setIsDiscretionary(true);
        } else if (
          catLower.includes("rent") ||
          catLower.includes("food") ||
          catLower.includes("transport") ||
          catLower.includes("utilities") ||
          catLower.includes("healthcare") ||
          catLower.includes("education")
        ) {
          setIsDiscretionary(false);
        }
      }
    } else if (type === "INCOME" && !categories.includes(category)) {
      setCategory("Salary / Stipend");
      setIsDiscretionary(false);
    }
  }, [type, category]);

  const handleParsedReceipt = (result: ParsedReceipt) => {
    if (result.amount) {
      setAmount(String(result.amount));
    }
    if (result.merchant) {
      setDescription(result.merchant);
    }
    if (result.category) {
      setCategory(result.category);
      if (result.category.toLowerCase().includes("discretionary") || result.category.toLowerCase().includes("shopping")) {
        setIsDiscretionary(true);
      } else {
        setIsDiscretionary(false);
      }
    }
    setType("EXPENSE");
    const conf = (result.confidence || result.ocrConfidence || "HIGH").toUpperCase();
    setScanConfidence(conf);
    setRawOcrText(result.rawOcrText || result.rawText || null);
    setShowScanModal(false);
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    try {
      setSubmitting(true);
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          category,
          amount: Number(amount),
          description,
          isDiscretionary: type === "EXPENSE" ? isDiscretionary : false,
          source: scanConfidence ? "ocr" : "manual",
          ocrConfidence: scanConfidence || undefined,
          rawOcrText: rawOcrText || undefined,
        }),
      });

      if (res.ok) {
        setAmount("");
        setDescription("");
        setScanConfidence(null);
        setRawOcrText(null);
        fetchTransactions();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (typeof window !== "undefined" && !window.confirm("Are you sure you want to delete this transaction?")) {
      return;
    }
    try {
      const res = await fetch(`/api/transactions?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setTransactions((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartEdit = (tx: Transaction) => {
    setEditingTx(tx);
    setEditType(tx.type);
    setEditCategory(tx.category);
    setEditAmount(tx.amount.toString());
    setEditDescription(tx.description || "");
    setEditIsDiscretionary(tx.isDiscretionary);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTx || !editAmount || Number(editAmount) <= 0) return;

    try {
      setEditSubmitting(true);
      const res = await fetch("/api/transactions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingTx.id,
          type: editType,
          category: editCategory,
          amount: Number(editAmount),
          description: editDescription,
          isDiscretionary: editType === "EXPENSE" ? editIsDiscretionary : false,
        }),
      });

      if (res.ok) {
        setEditingTx(null);
        fetchTransactions();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEditSubmitting(false);
    }
  };

  const txIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = txIncome > 0 ? txIncome : userIncome;

  const totalExpenses = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  const discretionaryAmount = transactions
    .filter(
      (t) =>
        t.type === "EXPENSE" &&
        (t.isDiscretionary ||
          t.category.toLowerCase().includes("discretionary") ||
          t.category.toLowerCase().includes("shopping"))
    )
    .reduce((sum, t) => sum + t.amount, 0);

  const rawNetSavings = totalIncome - totalExpenses;
  const isNetDeficit = rawNetSavings < 0;
  const netSavings = Math.abs(rawNetSavings);

  const filteredTransactions = transactions.filter((t) => {
    if (filterType === "INCOME") return t.type === "INCOME";
    if (filterType === "EXPENSE") return t.type === "EXPENSE";
    if (filterType === "DISCRETIONARY") return t.type === "EXPENSE" && t.isDiscretionary;
    return true;
  });

  return (
    <div className="space-y-12 animate-fadeIn font-sans">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-fogVeil uppercase tracking-widest">
            Cashflow Tracking Engine
          </span>
          <span className="badge-frost text-[10px]">Active Ledger</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-medium text-pureWhite mt-1">
          Income & Expense Tracker
        </h1>
        <p className="text-xs text-moonMist mt-1">
          Log cash movements to automatically calibrate your Financial Health Score.
        </p>
      </div>

      {/* Summary Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-plate p-5 space-y-1.5 card-tactile">
          <div className="flex items-center justify-between text-xs text-fogVeil font-mono">
            <span>TOTAL INCOME</span>
            <TrendingUp className="w-4 h-4 text-blueprintBlue" />
          </div>
          <div className="font-display text-2xl font-medium text-pureWhite font-mono tabular-nums">
            <CountUp value={totalIncome} prefix="₹" isCurrency />
          </div>
        </div>

        <div className="glass-plate p-5 space-y-1.5 card-tactile">
          <div className="flex items-center justify-between text-xs text-fogVeil font-mono">
            <span>TOTAL EXPENSES</span>
            <TrendingDown className="w-4 h-4 text-negativeCoral" />
          </div>
          <div className="font-display text-2xl font-medium text-moonMist font-mono tabular-nums">
            <CountUp value={totalExpenses} prefix="₹" isCurrency />
          </div>
        </div>

        <div className="glass-plate p-5 space-y-1.5 card-tactile">
          <div className="flex items-center justify-between text-xs text-fogVeil font-mono">
            <span>DISCRETIONARY (WANTS)</span>
            <Link href="/literacy?module=50-30-20-rule" title="What is Discretionary Spend?">
              <HelpCircle className="w-4 h-4 text-fogVeil hover:text-pureWhite transition-colors" />
            </Link>
          </div>
          <div className="font-display text-2xl font-medium text-frostGlow font-mono tabular-nums">
            <CountUp value={discretionaryAmount} prefix="₹" isCurrency />
          </div>
        </div>

        <div className="glass-plate p-5 space-y-1.5 card-tactile">
          <div className="flex items-center justify-between text-xs text-fogVeil font-mono">
            <span>{isNetDeficit ? "NET MONTHLY DEFICIT" : "NET MONTHLY SAVED"}</span>
            {isNetDeficit ? (
              <TrendingDown className="w-4 h-4 text-negativeCoral" />
            ) : (
              <DollarSign className="w-4 h-4 text-positiveMint" />
            )}
          </div>
          <div
            className={`font-display text-2xl font-medium font-mono tabular-nums ${
              isNetDeficit ? "text-negativeCoral" : "text-positiveMint"
            }`}
          >
            <CountUp value={netSavings} prefix={isNetDeficit ? "-₹" : "₹"} isCurrency />
          </div>
        </div>
      </div>

      {/* Main Grid: Add Transaction Form & History List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Transaction Form (1 Col) */}
        <div className="glass-plate p-6 space-y-5 h-fit">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <PlusCircle className="w-4 h-4 text-frostGlow" />
              <h2 className="font-display text-lg font-medium text-pureWhite">Record Cashflow</h2>
            </div>
            <button
              type="button"
              onClick={() => setShowScanModal(true)}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono text-blueprintBlue bg-blueprintBlue/10 hover:bg-blueprintBlue/20 border border-blueprintBlue/30 transition-all cursor-pointer card-tactile"
              title="Scan UPI or payment receipt screenshot"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Scan Receipt</span>
            </button>
          </div>

          <form onSubmit={handleAddTransaction} className="space-y-4">
            {scanConfidence && (
              <div className="flex items-center justify-between p-2 rounded-md bg-white/[0.04] border border-glassEdge text-[11px] font-mono">
                <span className="text-fogVeil">Auto-filled via OCR:</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-semibold ${
                    scanConfidence === "HIGH"
                      ? "bg-positiveMint/10 text-positiveMint border border-positiveMint/30"
                      : scanConfidence === "MEDIUM"
                      ? "bg-amberGlow/10 text-amberGlow border border-amberGlow/30"
                      : "bg-fogVeil/10 text-fogVeil border border-fogVeil/30"
                  }`}
                >
                  {scanConfidence} Confidence
                </span>
              </div>
            )}
            {/* Type selector: 6px frosted segmented control with tactile click feedback */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-white/[0.03] rounded-md border border-glassEdge">
              <button
                type="button"
                onClick={() => {
                  setType("EXPENSE");
                  setCategory("Discretionary / Outings");
                }}
                className={`py-2 rounded-md text-xs font-medium transition-all duration-200 active:scale-95 cursor-pointer ${
                  type === "EXPENSE"
                    ? "bg-white/[0.12] text-pureWhite border border-frostGlow/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_0_12px_rgba(182,217,252,0.15)]"
                    : "text-fogVeil hover:text-pureWhite hover:bg-white/[0.04]"
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => {
                  setType("INCOME");
                  setCategory("Salary / Stipend");
                }}
                className={`py-2 rounded-md text-xs font-medium transition-all duration-200 active:scale-95 cursor-pointer ${
                  type === "INCOME"
                    ? "bg-white/[0.12] text-pureWhite border border-frostGlow/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_0_12px_rgba(182,217,252,0.15)]"
                    : "text-fogVeil hover:text-pureWhite hover:bg-white/[0.04]"
                }`}
              >
                Income
              </button>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-fogVeil mb-1.5">
                Amount (₹) *
              </label>
              <input
                type="number"
                required
                placeholder="e.g. 2500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-frosted w-full px-3.5 py-2.5 text-sm"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-fogVeil mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-frosted w-full px-3.5 py-2.5 text-sm bg-[#05060f]"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-fogVeil mb-1.5">
                Note / Description
              </label>
              <input
                type="text"
                placeholder="e.g. Dinner with friends, Metro pass..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-frosted w-full px-3.5 py-2.5 text-sm"
              />
            </div>

            {/* Discretionary Checkbox */}
            {type === "EXPENSE" && (
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="discretionaryCheck"
                  checked={isDiscretionary}
                  onChange={(e) => setIsDiscretionary(e.target.checked)}
                  className="w-4 h-4 rounded-sm text-voidViolet bg-white/5 border-glassEdge focus:ring-voidViolet"
                />
                <label htmlFor="discretionaryCheck" className="text-xs text-moonMist">
                  Mark as <strong className="text-frostGlow">Discretionary / Want</strong> (non-essential)
                </label>
              </div>
            )}

            {/* Submit Button: 6px Void Violet CTA */}
            <button
              type="submit"
              disabled={submitting}
              className="btn-void-violet w-full text-xs py-2.5 cursor-pointer disabled:opacity-50"
            >
              {submitting ? "Recording..." : "Record Transaction"}
            </button>
          </form>
        </div>

        {/* Transaction History List (2 Cols) */}
        <div className="lg:col-span-2 glass-plate p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-glassEdge pb-4">
            <h2 className="font-display text-lg font-medium text-pureWhite">Ledger Entries</h2>

            {/* Filter pills with smooth tactile feedback */}
            <div className="flex items-center space-x-1 p-0.5 rounded-full bg-white/[0.03] border border-glassEdge text-xs">
              <Filter className="w-3.5 h-3.5 text-fogVeil ml-2 flex-shrink-0" />
              {["ALL", "EXPENSE", "INCOME", "DISCRETIONARY"].map((ft) => {
                const isActive = filterType === ft;
                return (
                  <button
                    key={ft}
                    type="button"
                    onClick={() => setFilterType(ft)}
                    className={`tab-pill px-3 py-1 ${
                      isActive ? "tab-pill-active" : ""
                    }`}
                  >
                    <span className="relative z-10 flex items-center space-x-1">
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blueprintBlue animate-pulse shadow-[0_0_8px_#b6d9fc]" />
                      )}
                      <span>{ft === "DISCRETIONARY" ? "Wants" : ft}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {loading ? (
            <p className="text-xs text-fogVeil text-center py-10 font-mono">Loading history...</p>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <AlertCircle className="w-8 h-8 text-fogVeil/50 mx-auto" />
              <p className="text-xs text-fogVeil font-mono">No transactions match your criteria.</p>
            </div>
          ) : (
            <div key={filterType} className="space-y-2 max-h-[520px] overflow-y-auto pr-1 animate-fadeIn transition-all duration-300">
              {filteredTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3.5 rounded-xl bg-white/[0.02] border border-glassEdge hover:border-frostGlow/30 hover:bg-white/[0.04] card-tactile flex items-center justify-between transition-all duration-200 text-xs group"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center border border-glassEdge transition-colors ${
                        tx.type === "INCOME"
                          ? "bg-positiveMint/10 text-positiveMint"
                          : tx.isDiscretionary
                          ? "bg-white/[0.06] text-frostGlow"
                          : "bg-white/[0.03] text-fogVeil"
                      }`}
                    >
                      <Tag className="w-3.5 h-3.5" />
                    </div>

                    <div>
                      <div className="font-medium text-pureWhite flex items-center space-x-2">
                        <span>{tx.category}</span>
                        {tx.isDiscretionary && (
                          <span className="badge-frost text-[9px] py-0.5">
                            Wants
                          </span>
                        )}
                        {tx.source === "ocr" && (
                          <span className="badge-frost text-[9px] py-0.5 text-blueprintBlue border-blueprintBlue/30 bg-blueprintBlue/10 font-mono">
                            Scan • {tx.ocrConfidence || "OCR"}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-fogVeil flex items-center space-x-2 mt-0.5 font-mono">
                        <span>{tx.description || "Cash movement"}</span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-fogVeil/70" />
                          <span>{new Date(tx.date).toLocaleDateString("en-IN")}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span
                      className={`font-mono font-medium text-sm tabular-nums transition-colors ${
                        tx.type === "INCOME" ? "text-positiveMint" : "text-pureWhite group-hover:text-frostGlow"
                      }`}
                    >
                      {tx.type === "INCOME" ? "+" : "-"}₹{tx.amount.toLocaleString("en-IN")}
                    </span>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleStartEdit(tx)}
                        className="p-1.5 text-fogVeil hover:text-pureWhite transition-colors cursor-pointer"
                        title="Edit record"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(tx.id)}
                        className="p-1.5 text-fogVeil hover:text-negativeCoral transition-colors cursor-pointer"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Transaction Modal */}
      {editingTx && (
        <div className="fixed inset-0 z-[250] bg-[#05060f]/80 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn">
          <div className="glass-plate max-w-md w-full p-6 sm:p-7 border border-glassEdge space-y-5 relative shadow-2xl">
            <div className="flex items-center justify-between border-b border-glassEdge pb-3">
              <div className="flex items-center space-x-2">
                <Pencil className="w-4 h-4 text-frostGlow" />
                <h3 className="font-display text-lg font-medium text-pureWhite">Edit Transaction</h3>
              </div>
              <button
                onClick={() => setEditingTx(null)}
                className="p-1 text-fogVeil hover:text-pureWhite rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-2 gap-1 p-1 bg-white/[0.03] rounded-md border border-glassEdge">
                <button
                  type="button"
                  onClick={() => {
                    setEditType("EXPENSE");
                    setEditCategory("Discretionary / Outings");
                  }}
                  className={`py-2 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    editType === "EXPENSE"
                      ? "bg-white/[0.1] text-pureWhite border border-glassEdge"
                      : "text-fogVeil hover:text-pureWhite"
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditType("INCOME");
                    setEditCategory("Salary / Stipend");
                  }}
                  className={`py-2 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    editType === "INCOME"
                      ? "bg-white/[0.1] text-pureWhite border border-glassEdge"
                      : "text-fogVeil hover:text-pureWhite"
                  }`}
                >
                  Income
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-fogVeil mb-1.5">
                  Amount (₹) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 2500"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="input-frosted w-full px-3.5 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-fogVeil mb-1.5">Category</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="input-frosted w-full px-3.5 py-2.5 text-sm bg-[#05060f]"
                >
                  {(editType === "EXPENSE"
                    ? [
                        "Discretionary / Outings",
                        "Rent & Housing",
                        "Food & Groceries",
                        "Transport",
                        "Utilities & Wifi",
                        "Shopping & Subscriptions",
                        "Healthcare",
                        "Education & Books",
                        "Other Expense",
                      ]
                    : ["Salary / Stipend", "Freelance / Projects", "Investments", "Gifts", "Other Income"]
                  ).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-fogVeil mb-1.5">
                  Note / Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dinner with friends, Metro pass..."
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="input-frosted w-full px-3.5 py-2.5 text-sm"
                />
              </div>

              {editType === "EXPENSE" && (
                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="editDiscretionaryCheck"
                    checked={editIsDiscretionary}
                    onChange={(e) => setEditIsDiscretionary(e.target.checked)}
                    className="w-4 h-4 rounded-sm text-voidViolet bg-white/5 border-glassEdge focus:ring-voidViolet"
                  />
                  <label htmlFor="editDiscretionaryCheck" className="text-xs text-moonMist">
                    Mark as <strong className="text-frostGlow">Discretionary / Want</strong> (non-essential)
                  </label>
                </div>
              )}

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTx(null)}
                  className="btn-pill w-1/2 text-xs py-2.5 cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="btn-void-violet w-1/2 text-xs py-2.5 cursor-pointer disabled:opacity-50"
                >
                  {editSubmitting ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Screenshot Upload Modal */}
      <ScreenshotUpload
        isOpen={showScanModal}
        onClose={() => setShowScanModal(false)}
        onParsed={handleParsedReceipt}
      />
    </div>
  );
}
