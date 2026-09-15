"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  BookOpen,
  Clock,
  CheckCircle2,
  X,
  Search,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  PieChart,
  CreditCard,
  Target,
  RefreshCw,
  TrendingUp,
  ShieldCheck,
  Receipt,
  DollarSign,
  Calculator,
} from "lucide-react";
import TaxCalculatorModule from "@/components/TaxCalculatorModule";
import DepositCalculatorModule from "@/components/DepositCalculatorModule";

interface LiteracyModule {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  keyTakeaways: string;
  readTimeMinutes: number;
}

function LiteracyContent() {
  const searchParams = useSearchParams();
  const activeSlug = searchParams.get("module");

  const [modules, setModules] = useState<LiteracyModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState<LiteracyModule | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [activeCalculator, setActiveCalculator] = useState<"TAX" | "DEPOSITS">("TAX");

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/literacy");
        const data = await res.json();
        const list: LiteracyModule[] = data.modules || [];
        setModules(list);

        if (activeSlug) {
          const match = list.find((m) => m.slug === activeSlug);
          if (match) setSelectedModule(match);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchModules();
  }, [activeSlug]);

  const filteredModules = modules.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.summary.toLowerCase().includes(searchQuery.toLowerCase());

    const catNorm = categoryFilter.toLowerCase().replace(/s$/, "");
    const modCatNorm = m.category.toLowerCase().replace(/s$/, "");
    const matchesCategory =
      categoryFilter === "ALL" ||
      modCatNorm.includes(catNorm) ||
      catNorm.includes(modCatNorm);

    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes("emergency")) return ShieldAlert;
    if (c.includes("budget")) return PieChart;
    if (c.includes("credit") || c.includes("loan") || c.includes("card")) return CreditCard;
    if (c.includes("invest") || c.includes("wealth") || c.includes("compound")) return TrendingUp;
    if (c.includes("insurance") || c.includes("protect")) return ShieldCheck;
    if (c.includes("tax")) return Receipt;
    return Target;
  };

  return (
    <div className="space-y-12 animate-fadeIn font-sans">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-fogVeil uppercase tracking-widest">
            Contextual Financial Literacy
          </span>
          <span className="badge-frost text-[10px]">Gentle Learning</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-medium text-pureWhite mt-1 tracking-tight">
          Financial Education & Simulators
        </h1>
        <p className="text-xs text-moonMist mt-1">
          Interactive tax and deposit calculators paired with bite-sized explainer cards for everyday Indian finance.
        </p>
      </div>

      {/* Interactive Wealth & Tax Simulators Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Calculator className="w-4 h-4 text-frostGlow" />
            <h2 className="font-display text-lg font-medium text-pureWhite">
              Interactive Wealth & Tax Simulators
            </h2>
          </div>
          <div className="flex items-center p-1 bg-white/[0.03] rounded-md border border-glassEdge self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveCalculator("TAX")}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all cursor-pointer ${
                activeCalculator === "TAX"
                  ? "bg-white/[0.12] text-pureWhite border border-frostGlow/40 shadow-sm"
                  : "text-fogVeil hover:text-pureWhite"
              }`}
            >
              Tax Regime (Old vs New)
            </button>
            <button
              type="button"
              onClick={() => setActiveCalculator("DEPOSITS")}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all cursor-pointer ${
                activeCalculator === "DEPOSITS"
                  ? "bg-white/[0.12] text-pureWhite border border-frostGlow/40 shadow-sm"
                  : "text-fogVeil hover:text-pureWhite"
              }`}
            >
              FD & RD Compounding
            </button>
          </div>
        </div>

        {activeCalculator === "TAX" && <TaxCalculatorModule />}
        {activeCalculator === "DEPOSITS" && <DepositCalculatorModule />}
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input: 6px frosted */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-fogVeil absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search concepts (e.g. DTI, SIP, Taxes)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-frosted w-full pl-10 pr-4 py-2 text-xs placeholder-fogVeil/60"
          />
        </div>

        {/* Categories Pills: 999px with smooth tactile touch & illuminated indicator */}
        <div className="flex items-center space-x-1.5 p-1 rounded-full bg-white/[0.02] border border-glassEdge text-xs overflow-x-auto w-full sm:w-auto scrollbar-none">
          {[
            "ALL",
            "Emergency Funds",
            "Credit & Loans",
            "Budgeting",
            "Investing & Wealth",
            "Insurance & Protection",
            "Taxes & Planning",
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

      {/* Cards Grid: 16px Frosted Glass Plates with Inset Glow & smooth transition */}
      {loading ? (
        <p className="text-xs text-fogVeil text-center py-12 font-mono">Loading literacy cards...</p>
      ) : filteredModules.length === 0 ? (
        <p className="text-xs text-fogVeil text-center py-12 font-mono">No cards match your search.</p>
      ) : (
        <div key={categoryFilter} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 animate-fadeIn transition-all duration-300">
          {filteredModules.map((m) => {
            const Icon = getCategoryIcon(m.category);
            return (
              <div
                key={m.id}
                onClick={() => setSelectedModule(m)}
                className="glass-plate glass-plate-hover card-tactile p-6 flex flex-col justify-between space-y-4 cursor-pointer group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="badge-frost text-[10px]">
                      {m.category}
                    </span>
                    <span className="text-[11px] text-fogVeil flex items-center space-x-1.5 font-mono">
                      <Clock className="w-3 h-3 text-blueprintBlue" />
                      <span>{m.readTimeMinutes} min read</span>
                    </span>
                  </div>

                  <div className="flex items-start space-x-3.5">
                    <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-glassEdge flex items-center justify-center text-frostGlow flex-shrink-0 group-hover:scale-105 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-medium text-pureWhite group-hover:text-iceHighlight transition-colors">
                        {m.title}
                      </h3>
                      <p className="text-xs text-moonMist leading-relaxed mt-1">{m.summary}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-glassEdge flex items-center justify-between text-xs text-frostGlow font-medium">
                  <span>Read Explainer Card</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-fogVeil" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL DRAWER FOR READING SELECTED MODULE */}
      {selectedModule && (
        <div className="fixed inset-0 z-[200] w-full h-full overflow-y-auto bg-[#05060f]/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div className="glass-plate max-w-2xl w-full max-h-[85vh] p-6 sm:p-8 space-y-6 overflow-y-auto relative my-auto shadow-2xl border border-glassEdge">
            {/* Close Button */}
            <button
              onClick={() => setSelectedModule(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/[0.04] border border-glassEdge text-fogVeil hover:text-pureWhite transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="space-y-2 pr-8">
              <div className="flex items-center space-x-2">
                <span className="badge-frost text-[10px]">
                  {selectedModule.category}
                </span>
                <span className="text-xs text-fogVeil flex items-center space-x-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-blueprintBlue" />
                  <span>{selectedModule.readTimeMinutes} minute read</span>
                </span>
              </div>

              <h2 className="font-display text-2xl font-medium text-pureWhite">
                {selectedModule.title}
              </h2>
              <p className="text-xs text-moonMist">{selectedModule.summary}</p>
            </div>

            {/* Key Takeaways Box */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-glassEdge space-y-2 text-xs">
              <div className="font-medium text-frostGlow flex items-center space-x-1.5 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-blueprintBlue" />
                <span>Key Takeaways at a Glance:</span>
              </div>
              <ul className="space-y-1.5 text-moonMist">
                {(() => {
                  let items: string[] = [];
                  try {
                    items = typeof selectedModule.keyTakeaways === "string"
                      ? JSON.parse(selectedModule.keyTakeaways)
                      : (Array.isArray(selectedModule.keyTakeaways) ? selectedModule.keyTakeaways : []);
                  } catch {
                    items = selectedModule.keyTakeaways ? [selectedModule.keyTakeaways] : [];
                  }
                  return items.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-positiveMint mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ));
                })()}
              </ul>
            </div>

            {/* Content Body */}
            <div className="text-xs leading-relaxed text-moonMist space-y-3 border-t border-glassEdge pt-4 whitespace-pre-line">
              {selectedModule.content}
            </div>

            {/* Footer action: 6px Void Violet button */}
            <div className="pt-4 border-t border-glassEdge flex justify-end">
              <button
                onClick={() => setSelectedModule(null)}
                className="btn-void-violet text-xs py-2 px-6 cursor-pointer"
              >
                Got It, Thanks!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LiteracyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
          <RefreshCw className="w-6 h-6 text-frostGlow animate-spin" />
          <p className="text-xs text-fogVeil font-mono">Loading literacy modules...</p>
        </div>
      }
    >
      <LiteracyContent />
    </Suspense>
  );
}
