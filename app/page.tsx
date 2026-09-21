"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  BookOpen,
  PieChart,
  CheckCircle2,
  Lock,
  ChevronRight,
  Users,
  Check,
  Zap,
  HelpCircle,
  Sparkles,
  Sliders,
  DollarSign,
  Award,
} from "lucide-react";
import { CountUp } from "@/components/motion/CountUp";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();
  const [heroEmail, setHeroEmail] = useState("");
  const [activeStep, setActiveStep] = useState(1);
  const [selectedGoalOption, setSelectedGoalOption] = useState("emergency");
  const [incomeRange, setIncomeRange] = useState("₹30,000 - ₹50,000");

  const handleHeroEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Pre-fill the email on the auth page via query param
    router.push(`/auth?email=${encodeURIComponent(heroEmail)}`);
  };


  const fannedGoals = [
    {
      id: "budget",
      title: "Expense Discipline",
      eyebrow: "CASHFLOW LEAK CONTROL",
      description: "Plug silent spending leaks using the 50/30/20 rule before building large assets.",
      metric: "Save ₹3,500/mo",
      target: "Under 30% Wants",
      icon: PieChart,
      color: "text-moonMist",
    },
    {
      id: "emergency",
      title: "Emergency Runway",
      eyebrow: "CRITICAL FOUNDATION",
      description: "Build an accessible 3-6 month liquid safety reserve to protect against unforeseen disruptions.",
      metric: "3-6 Months Buffer",
      target: "Liquid Savings",
      icon: ShieldCheck,
      color: "text-frostGlow",
      isCenter: true,
    },
    {
      id: "loan",
      title: "Borrowing Capacity",
      eyebrow: "DTI UNDERWRITING",
      description: "Verify your debt-to-income limits and see exactly what real bank loans you qualify for.",
      metric: "Safe DTI < 40%",
      target: "Zero Credit Inquiry",
      icon: CreditCard,
      color: "text-moonMist",
    },
  ];

  return (
    <div className="space-y-28 py-6 font-sans">
      {/* 1. HERO SECTION: Frosted Glass Cathedral Atmosphere with Ambient Drift */}
      <section className="relative text-center pt-20 pb-24 px-4 sm:px-8 overflow-hidden rounded-2xl glass-plate border border-glassEdge">
        {/* Top ambient spotlight halo: 75s slow-drift shimmers quietly behind hero */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 bg-ambient-shimmer"
          style={{
            background: "radial-gradient(circle at 50% 20%, rgba(182, 217, 252, 0.18) 0%, rgba(102, 58, 243, 0.12) 40%, transparent 75%)",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <ScrollReveal staggerChildrenMs={70} className="space-y-6">
            {/* Eyebrow Label with flanking fading lines */}
            <div className="eyebrow-divider">
              <span>FINANCIAL INCLUSION • DEMYSTIFYING MONEY</span>
            </div>

            {/* Display Heading in Space Grotesk (Weight 500 — calm, wide presence) with Ice Highlight */}
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-medium tracking-tight text-pureWhite leading-[1.08]">
              Growing financial clarity,{" "}
              <span className="text-ice-highlight">
                inspiring confidence.
              </span>
            </h1>

            {/* Supporting Subtext in Moon Mist */}
            <p className="text-base sm:text-lg text-moonMist max-w-2xl mx-auto leading-relaxed">
              FinAccess translates bank jargon into a plain-English Financial Health Score, tailored savings timelines, and transparent bank loan eligibility with zero upselling.
            </p>

            {/* Hero Form: 6px Frosted Input + 6px Void Violet CTA Combo */}
            <div className="pt-2 max-w-md mx-auto">
              <form
                onSubmit={handleHeroEmailSubmit}
                className="flex flex-col sm:flex-row items-center p-1.5 glass-plate rounded-md border border-glassEdge gap-2"
              >
                <input
                  type="email"
                  placeholder="username@gmail.com"
                  value={heroEmail}
                  onChange={(e) => setHeroEmail(e.target.value)}
                  className="w-full bg-transparent px-3.5 py-2 text-xs sm:text-sm text-pureWhite placeholder-fogVeil/60 focus:outline-none"
                />
                <button
                  type="submit"
                  className="btn-void-violet w-full sm:w-auto text-xs whitespace-nowrap cursor-pointer"
                >
                  <span>Start Journey</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
              <p className="text-[11px] text-fogVeil mt-2.5 text-center font-mono">
                Free account • Your data stays private and isolated
              </p>

            </div>

            <div className="flex items-center justify-center gap-4 pt-2">
              {session ? (
                <Link href="/dashboard" className="btn-void-violet text-xs py-2.5 px-6 cursor-pointer">
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <Link href="/auth" className="btn-void-violet text-xs py-2.5 px-6 cursor-pointer">
                  <span>Get Started Free</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
              <Link href="/literacy" className="btn-pill inline-flex items-center space-x-1.5 cursor-pointer">
                <span>3-Min Explainer Cards</span>
                <ChevronRight className="w-3.5 h-3.5 text-fogVeil" />
              </Link>
            </div>

          </ScrollReveal>
        </div>
      </section>

      {/* 2. LIGHTWEIGHT STATS BAR (Four-Column Cathedral Metrics with Tabular Counting Numbers) */}
      <section className="py-2 px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center max-w-5xl mx-auto">
          <div className="space-y-1">
            <div className="font-display text-3xl sm:text-4xl font-medium text-pureWhite tracking-tight">
              <CountUp end={2500} suffix="+" duration={1100} />
            </div>
            <div className="flex items-center justify-center space-x-1.5 text-xs text-fogVeil font-mono">
              <Users className="w-3.5 h-3.5 text-blueprintBlue" />
              <span>FIRST-TIME EARNERS</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="font-display text-3xl sm:text-4xl font-medium text-pureWhite tracking-tight">
              <CountUp end={15} suffix="x" duration={900} />
            </div>
            <div className="flex items-center justify-center space-x-1.5 text-xs text-fogVeil font-mono">
              <Zap className="w-3.5 h-3.5 text-blueprintBlue" />
              <span>FASTER CLARITY</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="font-display text-3xl sm:text-4xl font-medium text-pureWhite tracking-tight">
              <CountUp end={98} suffix="%" duration={1000} />
            </div>
            <div className="flex items-center justify-center space-x-1.5 text-xs text-fogVeil font-mono">
              <TrendingUp className="w-3.5 h-3.5 text-positiveMint" />
              <span>CONFIDENCE GAIN</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="font-display text-3xl sm:text-4xl font-medium text-pureWhite tracking-tight">
              <CountUp end={6} prefix="₹" suffix="M+" duration={1200} />
            </div>
            <div className="flex items-center justify-center space-x-1.5 text-xs text-fogVeil font-mono">
              <Award className="w-3.5 h-3.5 text-blueprintBlue" />
              <span>SAVINGS TARGETED</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SIGNATURE AUTHKIT "FAN LAYOUT": Onboarding Goal Selector */}
      <section className="space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <div className="eyebrow-divider">
            <span>TAILORED ROADMAP</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-medium text-pureWhite">
            Select Your Primary Focus Area
          </h2>
          <p className="text-xs text-moonMist">
            Choose what you want to unlock first. Our engine calibrates your benchmarks automatically.
          </p>
        </div>

        {/* Fanned 3-Card Layout with Staggered Scroll Entry */}
        <div className="relative max-w-5xl mx-auto px-4">
          <ScrollReveal staggerChildrenMs={90} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {fannedGoals.map((g) => {
              const isSelected = selectedGoalOption === g.id;
              const Icon = g.icon;
              return (
                <div
                  key={g.id}
                  onClick={() => setSelectedGoalOption(g.id)}
                  className={`glass-plate card-tactile p-6 sm:p-8 cursor-pointer transition-all duration-300 relative ${
                    g.isCenter
                      ? "md:-translate-y-3 md:scale-105 z-20 border-frostGlow/30 shadow-[inset_0_1px_2px_rgba(216,236,248,0.25),_0_24px_48px_rgba(0,0,0,0.8),_0_0_40px_rgba(102,58,243,0.15)]"
                      : "z-10 hover:border-glassEdge/80"
                  } ${
                    isSelected
                      ? "ring-1 ring-voidViolet/70 bg-[#121729]/90 shadow-[0_0_24px_rgba(102,58,243,0.2)]"
                      : "bg-[#0b0f1d]/75"
                  }`}
                >
                  {/* Selected check indicator badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="badge-frost text-[10px]">
                      {g.eyebrow}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-voidViolet text-white shadow-[0_0_12px_rgba(102,58,243,0.6)]"
                          : "border border-glassEdge text-transparent"
                      }`}
                    >
                      <Check className="w-3 h-3" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-glassEdge flex items-center justify-center">
                      <Icon className={`w-5 h-5 ${g.color}`} />
                    </div>
                    <h3 className="font-display text-lg font-medium text-pureWhite">
                      {g.title}
                    </h3>
                    <p className="text-xs text-moonMist leading-relaxed">
                      {g.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-glassEdge flex items-center justify-between text-xs font-mono">
                    <span className="text-fogVeil">{g.target}</span>
                    <span className="text-frostGlow font-medium">{g.metric}</span>
                  </div>
                </div>
              );
            })}
          </ScrollReveal>

          <div className="text-center pt-8">
            <Link
              href="/dashboard"
              className="btn-void-violet text-xs py-2.5 px-8 cursor-pointer shadow-[0_0_30px_rgba(102,58,243,0.5)]"
            >
              <span>Launch Personalized Engine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. PLATFORM CAPABILITIES CARDS (Three-Column Frosted Plates with Staggered Entry) */}
      <section className="space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <div className="eyebrow-divider">
            <span>CORE INTELLIGENCE</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-medium text-pureWhite">
            Designed for Financial Autonomy
          </h2>
          <p className="text-xs text-moonMist">
            Three interconnected modules engineered to give you absolute control over cashflow and credit.
          </p>
        </div>

        <ScrollReveal staggerChildrenMs={80} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Health Engine */}
          <div className="glass-plate glass-plate-hover card-tactile p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-glassEdge flex items-center justify-center text-frostGlow">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-medium text-pureWhite">
                Financial Health Score
              </h3>
              <p className="text-xs text-moonMist leading-relaxed">
                A single dynamic 0–100 score that balances savings rate, emergency reserve, debt burden, and budget discipline with interactive factor tooltips.
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-glassEdge text-xs font-mono text-fogVeil">
              <div className="flex justify-between">
                <span>Underwriting Model:</span>
                <span className="text-frostGlow">4 Weighted Factors</span>
              </div>
              <div className="flex justify-between">
                <span>Assessment Tone:</span>
                <span className="text-positiveMint">Constructive / Non-Judging</span>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="btn-pill flex items-center justify-center space-x-1.5 text-xs text-center"
            >
              <span>Calculate Score</span>
              <ArrowRight className="w-3 h-3 text-fogVeil" />
            </Link>
          </div>

          {/* Card 2: What-If Goals Simulator */}
          <div className="glass-plate glass-plate-hover card-tactile p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-glassEdge flex items-center justify-center text-frostGlow">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-medium text-pureWhite">
                "What-If" Savings Simulator
              </h3>
              <p className="text-xs text-moonMist leading-relaxed">
                Test custom monthly savings adjustments from +₹500 to +₹50,000 and witness immediate timeline compressions on active financial goals.
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-glassEdge text-xs font-mono text-fogVeil">
              <div className="flex justify-between">
                <span>Preset Chips:</span>
                <span className="text-frostGlow">₹500 → ₹50k</span>
              </div>
              <div className="flex justify-between">
                <span>Timeline Impact:</span>
                <span className="text-frostGlow">Months Saved Output</span>
              </div>
            </div>

            <Link
              href="/goals"
              className="btn-pill flex items-center justify-center space-x-1.5 text-xs text-center"
            >
              <span>Simulate Timelines</span>
              <ArrowRight className="w-3 h-3 text-fogVeil" />
            </Link>
          </div>

          {/* Card 3: Real Bank Loan Estimator */}
          <div className="glass-plate glass-plate-hover card-tactile p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-glassEdge flex items-center justify-center text-frostGlow">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-medium text-pureWhite">
                Real-World Bank Loans
              </h3>
              <p className="text-xs text-moonMist leading-relaxed">
                Compare 10 genuine loan products from SBI, HDFC, ICICI, Axis, and Tata Capital with transparent interest spreads and rule-based DTI eligibility checks.
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-glassEdge text-xs font-mono text-fogVeil">
              <div className="flex justify-between">
                <span>Prudent Ceiling:</span>
                <span className="text-frostGlow">50% Max Safe DTI</span>
              </div>
              <div className="flex justify-between">
                <span>Credit Bureau Check:</span>
                <span className="text-positiveMint">Zero Hard Pulls</span>
              </div>
            </div>

            <Link
              href="/loans"
              className="btn-pill flex items-center justify-center space-x-1.5 text-xs text-center"
            >
              <span>Compare Bank Loans</span>
              <ArrowRight className="w-3 h-3 text-fogVeil" />
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* 5. PRIVACY & TRANSPARENCY PROTOCOL */}
      <section className="glass-plate p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-6">
        <div className="eyebrow-divider">
          <span>ARCHITECTURAL INTEGRITY</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-medium text-pureWhite">
          Built for Protection, Not Commission
        </h2>
        <p className="text-xs sm:text-sm text-moonMist max-w-2xl mx-auto leading-relaxed">
          Traditional finance platforms monetize through affiliate credit cards and high-interest microloans. FinAccess exists purely as an educational and mathematical cockpit for first-time earners.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-mono text-fogVeil">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-positiveMint" />
            <span>Zero Affiliate Commissions</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-positiveMint" />
            <span>No Unsolicited Telemarketing</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-positiveMint" />
            <span>Encrypted Local Persistence</span>
          </div>
        </div>
      </section>
    </div>
  );
}
