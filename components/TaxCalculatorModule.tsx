"use client";

import { useState, useMemo } from "react";
import {
  Calculator,
  CheckCircle2,
  TrendingDown,
  Info,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import CountUp from "@/components/motion/CountUp";
import { compareTaxRegimes, TaxInput } from "@/lib/taxCalculator";

export default function TaxCalculatorModule() {
  const [grossIncome, setGrossIncome] = useState<number>(1200000);
  const [section80C, setSection80C] = useState<number>(150000);
  const [section80D, setSection80D] = useState<number>(25000);
  const [hraExemption, setHraExemption] = useState<number>(120000);
  const [otherDeductions, setOtherDeductions] = useState<number>(0);

  const comparison = useMemo(() => {
    const input: TaxInput = {
      grossIncome,
      section80C,
      section80D,
      hraExemption,
      otherDeductions,
    };
    return compareTaxRegimes(input);
  }, [grossIncome, section80C, section80D, hraExemption, otherDeductions]);

  const { oldRegime, newRegime, recommended, taxSavings } = comparison;

  return (
    <div className="space-y-6">
      <div className="glass-plate p-6 sm:p-7 border border-glassEdge space-y-6 relative overflow-hidden">
        {/* Glow ambient accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-voidViolet/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-glassEdge pb-5 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="badge-frost text-[10px] py-0.5 text-blueprintBlue border-blueprintBlue/30 bg-blueprintBlue/10 font-mono">
                FY 2024-25 (AY 2025-26)
              </span>
              <span className="text-xs text-fogVeil font-mono">Union Budget Revised</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-medium text-pureWhite flex items-center space-x-2">
              <span>Indian Tax Regime Comparison</span>
            </h2>
            <p className="text-xs text-moonMist max-w-xl">
              Compare your exact tax liabilities under the Old vs New Tax Regime with revised slabs, standard deductions, and 87A rebate thresholds.
            </p>
          </div>

          {/* Recommendation Pill */}
          <div className="self-start sm:self-center">
            {recommended === "NEW" ? (
              <div className="px-3.5 py-2 rounded-xl bg-positiveMint/10 border border-positiveMint/30 text-positiveMint text-xs font-mono flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-positiveMint" />
                <span>
                  New Regime saves{" "}
                  <strong className="font-semibold tabular-nums">
                    ₹{taxSavings.toLocaleString("en-IN")}
                  </strong>
                </span>
              </div>
            ) : recommended === "OLD" ? (
              <div className="px-3.5 py-2 rounded-xl bg-blueprintBlue/10 border border-blueprintBlue/30 text-blueprintBlue text-xs font-mono flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-blueprintBlue" />
                <span>
                  Old Regime saves{" "}
                  <strong className="font-semibold tabular-nums">
                    ₹{taxSavings.toLocaleString("en-IN")}
                  </strong>
                </span>
              </div>
            ) : (
              <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-glassEdge text-fogVeil text-xs font-mono flex items-center space-x-2">
                <span>Both Regimes equal tax liability</span>
              </div>
            )}
          </div>
        </div>

        {/* Compact Direct-Typing Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
          {/* Gross Annual Salary */}
          <div className="space-y-1.5 p-3 rounded-lg bg-white/[0.02] border border-glassEdge">
            <label className="block text-[11px] font-mono text-fogVeil">
              GROSS ANNUAL SALARY (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-fogVeil">₹</span>
              <input
                type="number"
                value={grossIncome || ""}
                onChange={(e) => setGrossIncome(Math.max(0, Number(e.target.value) || 0))}
                className="input-frosted w-full pl-7 pr-3 py-1.5 text-xs font-mono text-pureWhite tabular-nums"
                placeholder="e.g. 1200000"
              />
            </div>
            <div className="flex items-center space-x-1 pt-0.5 overflow-x-auto">
              {[800000, 1200000, 1800000, 2500000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setGrossIncome(preset)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer ${
                    grossIncome === preset
                      ? "bg-white/20 text-pureWhite border border-frostGlow/40"
                      : "bg-white/[0.03] text-fogVeil hover:text-pureWhite border border-glassEdge"
                  }`}
                >
                  ₹{preset / 100000}L
                </button>
              ))}
            </div>
          </div>

          {/* Section 80C */}
          <div className="space-y-1.5 p-3 rounded-lg bg-white/[0.02] border border-glassEdge">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-fogVeil">SECTION 80C (₹)</span>
              <span className="text-fogVeil/60 text-[10px]">Max ₹1.5L</span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-fogVeil">₹</span>
              <input
                type="number"
                value={section80C || ""}
                onChange={(e) => setSection80C(Math.min(150000, Math.max(0, Number(e.target.value) || 0)))}
                className="input-frosted w-full pl-7 pr-3 py-1.5 text-xs font-mono text-pureWhite tabular-nums"
                placeholder="e.g. 150000"
              />
            </div>
            <div className="flex items-center space-x-1 pt-0.5">
              {[0, 75000, 150000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setSection80C(preset)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer ${
                    section80C === preset
                      ? "bg-white/20 text-pureWhite border border-frostGlow/40"
                      : "bg-white/[0.03] text-fogVeil hover:text-pureWhite border border-glassEdge"
                  }`}
                >
                  {preset === 0 ? "₹0" : `₹${preset / 1000}k`}
                </button>
              ))}
            </div>
          </div>

          {/* Section 80D (Health Insurance) */}
          <div className="space-y-1.5 p-3 rounded-lg bg-white/[0.02] border border-glassEdge">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-fogVeil">80D HEALTH INSURANCE (₹)</span>
              <span className="text-fogVeil/60 text-[10px]">Max ₹75k</span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-fogVeil">₹</span>
              <input
                type="number"
                value={section80D || ""}
                onChange={(e) => setSection80D(Math.min(75000, Math.max(0, Number(e.target.value) || 0)))}
                className="input-frosted w-full pl-7 pr-3 py-1.5 text-xs font-mono text-pureWhite tabular-nums"
                placeholder="e.g. 25000"
              />
            </div>
            <div className="flex items-center space-x-1 pt-0.5">
              {[0, 25000, 50000, 75000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setSection80D(preset)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer ${
                    section80D === preset
                      ? "bg-white/20 text-pureWhite border border-frostGlow/40"
                      : "bg-white/[0.03] text-fogVeil hover:text-pureWhite border border-glassEdge"
                  }`}
                >
                  {preset === 0 ? "₹0" : `₹${preset / 1000}k`}
                </button>
              ))}
            </div>
          </div>

          {/* HRA Exemption */}
          <div className="space-y-1.5 p-3 rounded-lg bg-white/[0.02] border border-glassEdge">
            <label className="block text-[11px] font-mono text-fogVeil">
              HRA RENT EXEMPTION (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-fogVeil">₹</span>
              <input
                type="number"
                value={hraExemption || ""}
                onChange={(e) => setHraExemption(Math.max(0, Number(e.target.value) || 0))}
                className="input-frosted w-full pl-7 pr-3 py-1.5 text-xs font-mono text-pureWhite tabular-nums"
                placeholder="e.g. 120000"
              />
            </div>
            <div className="flex items-center space-x-1 pt-0.5">
              {[0, 60000, 120000, 240000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setHraExemption(preset)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer ${
                    hraExemption === preset
                      ? "bg-white/20 text-pureWhite border border-frostGlow/40"
                      : "bg-white/[0.03] text-fogVeil hover:text-pureWhite border border-glassEdge"
                  }`}
                >
                  {preset === 0 ? "₹0" : `₹${preset / 1000}k`}
                </button>
              ))}
            </div>
          </div>

          {/* Other Deductions */}
          <div className="space-y-1.5 p-3 rounded-lg bg-white/[0.02] border border-glassEdge">
            <label className="block text-[11px] font-mono text-fogVeil">
              OTHER DEDUCTIONS (NPS / 80E) (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-fogVeil">₹</span>
              <input
                type="number"
                value={otherDeductions || ""}
                onChange={(e) => setOtherDeductions(Math.max(0, Number(e.target.value) || 0))}
                className="input-frosted w-full pl-7 pr-3 py-1.5 text-xs font-mono text-pureWhite tabular-nums"
                placeholder="e.g. 50000"
              />
            </div>
            <div className="flex items-center space-x-1 pt-0.5">
              {[0, 25000, 50000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setOtherDeductions(preset)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer ${
                    otherDeductions === preset
                      ? "bg-white/20 text-pureWhite border border-frostGlow/40"
                      : "bg-white/[0.03] text-fogVeil hover:text-pureWhite border border-glassEdge"
                  }`}
                >
                  {preset === 0 ? "₹0" : `₹${preset / 1000}k`}
                </button>
              ))}
            </div>
          </div>

          {/* Slabs summary card */}
          <div className="p-3 rounded-lg bg-white/[0.02] border border-glassEdge flex flex-col justify-between text-[11px] font-mono">
            <span className="text-fogVeil">STANDARD DEDUCTION (2024)</span>
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-moonMist">
                <span>Old Regime:</span>
                <span className="text-pureWhite font-medium">₹50,000</span>
              </div>
              <div className="flex justify-between text-moonMist">
                <span>New Regime:</span>
                <span className="text-positiveMint font-medium">₹75,000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Side-by-Side Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 pt-2">
          {/* Old Tax Regime Card */}
          <div
            className={`p-5 rounded-xl border transition-all duration-200 card-tactile ${
              recommended === "OLD"
                ? "bg-white/[0.05] border-blueprintBlue/50 shadow-[0_0_20px_rgba(182,217,252,0.1)]"
                : "bg-white/[0.02] border-glassEdge"
            }`}
          >
            <div className="flex items-center justify-between border-b border-glassEdge pb-3">
              <div>
                <h3 className="font-display text-lg font-medium text-pureWhite flex items-center space-x-2">
                  <span>Old Tax Regime</span>
                  {recommended === "OLD" && (
                    <span className="badge-frost text-[9px] py-0.5 text-blueprintBlue border-blueprintBlue/30 bg-blueprintBlue/10 font-mono">
                      RECOMMENDED
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-fogVeil">Deduction-heavy regime (80C, 80D, HRA eligible)</p>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-fogVeil font-mono">EFFECTIVE RATE</div>
                <div className="text-xs font-mono font-medium text-moonMist tabular-nums">
                  {oldRegime.effectiveRate}%
                </div>
              </div>
            </div>

            <div className="py-4 space-y-2.5 text-xs font-mono">
              <div className="flex justify-between text-moonMist">
                <span>Gross Income</span>
                <span className="tabular-nums text-pureWhite">₹{oldRegime.grossIncome.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-moonMist">
                <span>Standard Deduction</span>
                <span className="tabular-nums text-positiveMint">-₹{oldRegime.standardDeduction.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-moonMist">
                <span>Itemized Deductions (80C/80D/HRA)</span>
                <span className="tabular-nums text-positiveMint">-₹{oldRegime.deductions.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-moonMist pt-1 border-t border-glassEdge/40">
                <span>Net Taxable Income</span>
                <span className="tabular-nums text-pureWhite font-medium">
                  ₹{oldRegime.taxableIncome.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between text-fogVeil">
                <span>Base Slab Tax</span>
                <span className="tabular-nums">₹{Math.round(oldRegime.baseTax).toLocaleString("en-IN")}</span>
              </div>
              {oldRegime.rebate87A > 0 && (
                <div className="flex justify-between text-positiveMint">
                  <span>Section 87A Rebate (taxable ≤ ₹5L)</span>
                  <span className="tabular-nums">-₹{Math.round(oldRegime.rebate87A).toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-fogVeil">
                <span>Health & Edu Cess (4%)</span>
                <span className="tabular-nums">₹{oldRegime.cess.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="border-t border-glassEdge pt-3 flex items-center justify-between">
              <span className="text-xs font-mono text-fogVeil">TOTAL TAX PAYABLE</span>
              <span className="text-xl font-display font-medium text-pureWhite font-mono tabular-nums">
                <CountUp value={oldRegime.totalTax} prefix="₹" isCurrency />
              </span>
            </div>
          </div>

          {/* New Tax Regime Card */}
          <div
            className={`p-5 rounded-xl border transition-all duration-200 card-tactile ${
              recommended === "NEW"
                ? "bg-white/[0.05] border-positiveMint/50 shadow-[0_0_20px_rgba(46,204,113,0.1)]"
                : "bg-white/[0.02] border-glassEdge"
            }`}
          >
            <div className="flex items-center justify-between border-b border-glassEdge pb-3">
              <div>
                <h3 className="font-display text-lg font-medium text-pureWhite flex items-center space-x-2">
                  <span>New Tax Regime</span>
                  {recommended === "NEW" && (
                    <span className="badge-frost text-[9px] py-0.5 text-positiveMint border-positiveMint/30 bg-positiveMint/10 font-mono">
                      RECOMMENDED
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-fogVeil">Default regime • Flat ₹75,000 std deduction</p>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-fogVeil font-mono">EFFECTIVE RATE</div>
                <div className="text-xs font-mono font-medium text-moonMist tabular-nums">
                  {newRegime.effectiveRate}%
                </div>
              </div>
            </div>

            <div className="py-4 space-y-2.5 text-xs font-mono">
              <div className="flex justify-between text-moonMist">
                <span>Gross Income</span>
                <span className="tabular-nums text-pureWhite">₹{newRegime.grossIncome.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-moonMist">
                <span>Standard Deduction (Budget 2024)</span>
                <span className="tabular-nums text-positiveMint">-₹{newRegime.standardDeduction.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-fogVeil italic">
                <span>Chapter VI-A Deductions</span>
                <span className="text-fogVeil">Not eligible</span>
              </div>
              <div className="flex justify-between text-moonMist pt-1 border-t border-glassEdge/40">
                <span>Net Taxable Income</span>
                <span className="tabular-nums text-pureWhite font-medium">
                  ₹{newRegime.taxableIncome.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between text-fogVeil">
                <span>Base Slab Tax (Revised Slabs)</span>
                <span className="tabular-nums">₹{Math.round(newRegime.baseTax).toLocaleString("en-IN")}</span>
              </div>
              {newRegime.rebate87A > 0 && (
                <div className="flex justify-between text-positiveMint">
                  <span>Section 87A Rebate (taxable ≤ ₹7L)</span>
                  <span className="tabular-nums">-₹{Math.round(newRegime.rebate87A).toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-fogVeil">
                <span>Health & Edu Cess (4%)</span>
                <span className="tabular-nums">₹{newRegime.cess.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="border-t border-glassEdge pt-3 flex items-center justify-between">
              <span className="text-xs font-mono text-fogVeil">TOTAL TAX PAYABLE</span>
              <span className="text-xl font-display font-medium text-pureWhite font-mono tabular-nums">
                <CountUp value={newRegime.totalTax} prefix="₹" isCurrency />
              </span>
            </div>
          </div>
        </div>

        {/* Regulatory Disclaimer */}
        <div className="p-3.5 rounded-lg bg-white/[0.02] border border-glassEdge text-[11px] text-fogVeil flex items-start space-x-2.5 relative z-10 font-mono">
          <ShieldAlert className="w-4 h-4 text-blueprintBlue shrink-0 mt-0.5" />
          <div>
            <strong className="text-pureWhite">Regulatory Disclaimer:</strong> This comparison is an educational simulation based on the Income-tax Act, 1961 provisions and Union Budget 2024 revisions. Surcharge rules for HNI income (&gt;₹50L) and marginal relief are simplified. Consult a certified Chartered Accountant before choosing your regime during ITR filing.
          </div>
        </div>
      </div>
    </div>
  );
}
