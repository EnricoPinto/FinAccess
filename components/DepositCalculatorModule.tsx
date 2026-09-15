"use client";

import { useState, useMemo } from "react";
import { Landmark, TrendingUp, PiggyBank, ShieldCheck, Clock } from "lucide-react";
import CountUp from "@/components/motion/CountUp";
import { calculateFD, calculateRD, DepositResult } from "@/lib/depositCalculators";

export default function DepositCalculatorModule() {
  const [depositType, setDepositType] = useState<"FD" | "RD">("FD");
  
  // FD states
  const [fdPrincipal, setFdPrincipal] = useState<number>(100000);
  // RD states
  const [rdMonthly, setRdMonthly] = useState<number>(5000);

  // Common states
  const [interestRate, setInterestRate] = useState<number>(7.1);
  const [tenureMonths, setTenureMonths] = useState<number>(36); // 3 years default
  const [isSeniorCitizen, setIsSeniorCitizen] = useState<boolean>(false);

  const result: DepositResult = useMemo(() => {
    if (depositType === "FD") {
      return calculateFD({
        principal: fdPrincipal,
        annualRate: interestRate,
        tenureMonths,
        isSeniorCitizen,
      });
    } else {
      return calculateRD({
        monthlyDeposit: rdMonthly,
        annualRate: interestRate,
        tenureMonths,
        isSeniorCitizen,
      });
    }
  }, [depositType, fdPrincipal, rdMonthly, interestRate, tenureMonths, isSeniorCitizen]);

  const principalRatio = result.maturityAmount > 0 ? (result.totalDeposit / result.maturityAmount) * 100 : 100;
  const interestRatio = Math.max(0, 100 - principalRatio);

  return (
    <div className="space-y-6">
      <div className="glass-plate p-6 sm:p-7 border border-glassEdge space-y-6 relative overflow-hidden">
        {/* Glow ambient accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-positiveMint/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

        {/* Header and Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-glassEdge pb-5 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="badge-frost text-[10px] py-0.5 text-positiveMint border-positiveMint/30 bg-positiveMint/10 font-mono">
                RBI & Post Office Standard
              </span>
              <span className="text-xs text-fogVeil font-mono">Quarterly Compounding</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-medium text-pureWhite flex items-center space-x-2">
              <span>Term Deposit Growth Calculators</span>
            </h2>
            <p className="text-xs text-moonMist max-w-xl">
              Simulate returns on guaranteed savings products with institutional quarterly interest compounding.
            </p>
          </div>

          {/* FD / RD Tab Pill Toggle */}
          <div className="flex items-center p-1 bg-white/[0.03] rounded-md border border-glassEdge self-start sm:self-center">
            <button
              type="button"
              onClick={() => setDepositType("FD")}
              className={`px-4 py-2 rounded-md text-xs font-mono font-medium transition-all duration-200 active:scale-95 cursor-pointer flex items-center space-x-1.5 ${
                depositType === "FD"
                  ? "bg-white/[0.12] text-pureWhite border border-frostGlow/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_0_12px_rgba(182,217,252,0.15)]"
                  : "text-fogVeil hover:text-pureWhite hover:bg-white/[0.04]"
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>Fixed Deposit (FD)</span>
            </button>
            <button
              type="button"
              onClick={() => setDepositType("RD")}
              className={`px-4 py-2 rounded-md text-xs font-mono font-medium transition-all duration-200 active:scale-95 cursor-pointer flex items-center space-x-1.5 ${
                depositType === "RD"
                  ? "bg-white/[0.12] text-pureWhite border border-frostGlow/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_0_12px_rgba(182,217,252,0.15)]"
                  : "text-fogVeil hover:text-pureWhite hover:bg-white/[0.04]"
              }`}
            >
              <PiggyBank className="w-3.5 h-3.5" />
              <span>Recurring Deposit (RD)</span>
            </button>
          </div>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          {/* Controls (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Amount Direct Input */}
            {depositType === "FD" ? (
              <div className="space-y-1.5 p-3 rounded-lg bg-white/[0.02] border border-glassEdge">
                <label className="block text-[11px] font-mono text-fogVeil">
                  TOTAL FIXED DEPOSIT AMOUNT (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-fogVeil">₹</span>
                  <input
                    type="number"
                    value={fdPrincipal || ""}
                    onChange={(e) => setFdPrincipal(Math.max(0, Number(e.target.value) || 0))}
                    className="input-frosted w-full pl-7 pr-3 py-1.5 text-xs font-mono text-pureWhite tabular-nums"
                    placeholder="e.g. 100000"
                  />
                </div>
                <div className="flex items-center space-x-1 pt-0.5 overflow-x-auto">
                  {[25000, 50000, 100000, 250000, 500000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setFdPrincipal(preset)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer ${
                        fdPrincipal === preset
                          ? "bg-white/20 text-pureWhite border border-frostGlow/40"
                          : "bg-white/[0.03] text-fogVeil hover:text-pureWhite border border-glassEdge"
                      }`}
                    >
                      {preset >= 100000 ? `₹${preset / 100000}L` : `₹${preset / 1000}k`}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 p-3 rounded-lg bg-white/[0.02] border border-glassEdge">
                <label className="block text-[11px] font-mono text-fogVeil">
                  MONTHLY INSTALLMENT DEPOSIT (₹ / MONTH)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-fogVeil">₹</span>
                  <input
                    type="number"
                    value={rdMonthly || ""}
                    onChange={(e) => setRdMonthly(Math.max(0, Number(e.target.value) || 0))}
                    className="input-frosted w-full pl-7 pr-3 py-1.5 text-xs font-mono text-pureWhite tabular-nums"
                    placeholder="e.g. 5000"
                  />
                </div>
                <div className="flex items-center space-x-1 pt-0.5 overflow-x-auto">
                  {[1000, 2500, 5000, 10000, 25000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setRdMonthly(preset)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer ${
                        rdMonthly === preset
                          ? "bg-white/20 text-pureWhite border border-frostGlow/40"
                          : "bg-white/[0.03] text-fogVeil hover:text-pureWhite border border-glassEdge"
                      }`}
                    >
                      ₹{preset >= 1000 ? `${preset / 1000}k/mo` : `${preset}/mo`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Interest Rate Direct Input */}
              <div className="space-y-1.5 p-3 rounded-lg bg-white/[0.02] border border-glassEdge">
                <label className="block text-[11px] font-mono text-fogVeil">
                  ANNUAL INTEREST RATE (% P.A.)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.05"
                    value={interestRate || ""}
                    onChange={(e) => setInterestRate(Math.max(0, Number(e.target.value) || 0))}
                    className="input-frosted w-full pl-3 pr-8 py-1.5 text-xs font-mono text-pureWhite tabular-nums"
                    placeholder="e.g. 7.1"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-fogVeil">%</span>
                </div>
                <div className="flex items-center space-x-1 pt-0.5">
                  {[6.8, 7.1, 7.5, 8.25].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setInterestRate(rate)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer ${
                        interestRate === rate
                          ? "bg-white/20 text-pureWhite border border-frostGlow/40"
                          : "bg-white/[0.03] text-fogVeil hover:text-pureWhite border border-glassEdge"
                      }`}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Tenure Direct Input */}
              <div className="space-y-1.5 p-3 rounded-lg bg-white/[0.02] border border-glassEdge">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-fogVeil">TENURE (MONTHS)</span>
                  <span className="text-frostGlow text-[10px]">
                    {Math.floor(tenureMonths / 12)}y {tenureMonths % 12 > 0 ? `${tenureMonths % 12}m` : ""}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={tenureMonths || ""}
                    onChange={(e) => setTenureMonths(Math.max(1, Number(e.target.value) || 1))}
                    className="input-frosted w-full px-3 py-1.5 text-xs font-mono text-pureWhite tabular-nums"
                    placeholder="e.g. 36"
                  />
                </div>
                <div className="flex items-center space-x-1 pt-0.5">
                  {[12, 24, 36, 60].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setTenureMonths(m)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer ${
                        tenureMonths === m
                          ? "bg-white/20 text-pureWhite border border-frostGlow/40"
                          : "bg-white/[0.03] text-fogVeil hover:text-pureWhite border border-glassEdge"
                      }`}
                    >
                      {m / 12}Y
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Senior Citizen Checkbox */}
            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="seniorCitizenCheck"
                checked={isSeniorCitizen}
                onChange={(e) => setIsSeniorCitizen(e.target.checked)}
                className="w-4 h-4 rounded-sm text-voidViolet bg-white/5 border-glassEdge focus:ring-voidViolet"
              />
              <label htmlFor="seniorCitizenCheck" className="text-xs text-moonMist font-mono cursor-pointer">
                Senior Citizen (Age 60+) Rate (+0.50% preferential interest)
              </label>
            </div>
          </div>

          {/* Results Summary Card (5 Cols) */}
          <div className="lg:col-span-5 glass-plate p-6 rounded-xl border border-glassEdge space-y-5 flex flex-col justify-between card-tactile">
            <div className="space-y-4">
              <div className="border-b border-glassEdge pb-3">
                <span className="text-[11px] font-mono text-fogVeil">PROJECTED MATURITY VALUE</span>
                <div className="text-3xl font-display font-medium text-pureWhite font-mono tabular-nums mt-1 text-positiveMint">
                  <CountUp value={result.maturityAmount} prefix="₹" isCurrency />
                </div>
              </div>

              {/* 2-Segment Breakdown Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-fogVeil">Principal ({principalRatio.toFixed(1)}%)</span>
                  <span className="text-positiveMint">Interest ({interestRatio.toFixed(1)}%)</span>
                </div>
                <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${principalRatio}%` }}
                    className="h-full bg-voidViolet transition-all duration-300"
                    title="Invested Principal"
                  />
                  <div
                    style={{ width: `${interestRatio}%` }}
                    className="h-full bg-positiveMint transition-all duration-300"
                    title="Compounded Interest"
                  />
                </div>
              </div>

              {/* Key Metric Rows */}
              <div className="space-y-2.5 text-xs font-mono pt-2">
                <div className="flex justify-between text-moonMist">
                  <span>Total Deposit Amount</span>
                  <span className="tabular-nums text-pureWhite font-medium">
                    ₹{result.totalDeposit.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-moonMist">
                  <span>Total Interest Earned</span>
                  <span className="tabular-nums text-positiveMint font-medium">
                    +₹{result.interestEarned.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-fogVeil">
                  <span>Effective Compounded Yield</span>
                  <span className="tabular-nums">{result.effectiveYield}% p.a.</span>
                </div>
                <div className="flex justify-between text-fogVeil">
                  <span>Compounding Frequency</span>
                  <span>Quarterly (every 3 mos)</span>
                </div>
              </div>
            </div>

            {/* Insurance Banner */}
            <div className="p-3 rounded-lg bg-white/[0.02] border border-glassEdge text-[11px] text-fogVeil flex items-center space-x-2 font-mono">
              <ShieldCheck className="w-4 h-4 text-positiveMint shrink-0" />
              <span>
                Protected under DICGC insurance up to <strong className="text-pureWhite">₹5 Lakhs</strong> per depositor per bank.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
