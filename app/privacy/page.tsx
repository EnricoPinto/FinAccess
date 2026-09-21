import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  ShieldCheck, 
  Lock, 
  Database, 
  Cpu, 
  EyeOff, 
  FileCheck2, 
  ArrowLeft,
  Server,
  KeyRound,
  CheckCircle2
} from "lucide-react";

export const metadata = {
  title: "Privacy & Data Security Policy | FinAccess",
  description: "Plain-language overview of how FinAccess handles, stores, and protects your financial data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-canvas text-frostGlow flex flex-col justify-between selection:bg-voidViolet/30">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 flex-1 w-full">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center space-x-2 text-xs font-mono text-fogVeil hover:text-pureWhite transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Overview</span>
          </Link>
        </div>

        {/* Hero Header */}
        <div className="mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-badge bg-white/[0.04] border border-glassEdge text-[11px] font-mono text-blueprintBlue uppercase tracking-wider mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-positiveMint" />
            <span>Institutional Data Protocol</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-pureWhite tracking-tight mb-4">
            Privacy & Security at FinAccess
          </h1>
          <p className="text-sm sm:text-base text-moonMist max-w-2xl leading-relaxed">
            We believe financial intelligence shouldn&apos;t come at the cost of your personal privacy. Here is an honest, plain-English breakdown of exactly what data we collect, how it&apos;s stored, and what encryption protects it.
          </p>
        </div>

        {/* Core Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Card 1: What We Collect */}
          <div className="glass-card p-6 sm:p-8 space-y-4">
            <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-glassEdge flex items-center justify-center text-frostGlow">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h2 className="font-display text-xl font-medium text-pureWhite">
              1. What Data We Collect
            </h2>
            <p className="text-xs sm:text-sm text-moonMist leading-relaxed">
              FinAccess collects only the specific data points required to calculate your Financial Health Score, DTI ratio, and budget allocations:
            </p>
            <ul className="space-y-2.5 text-xs text-moonMist pt-1">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-positiveMint mt-0.5 flex-shrink-0" />
                <span><strong>Income & Cashflows:</strong> Monthly earnings, logged expenses, and category tags (e.g., Rent, Utilities, Food).</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-positiveMint mt-0.5 flex-shrink-0" />
                <span><strong>Savings Goals & EMIs:</strong> Target goal amounts, monthly contributions, and recurring loan/card installment due dates.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-positiveMint mt-0.5 flex-shrink-0" />
                <span><strong>Receipt Screenshots:</strong> Uploaded payment slips or UPI receipts are read in-memory to extract amount and merchant notes. <em>The image files themselves are never permanently stored on our servers.</em></span>
              </li>
            </ul>
          </div>

          {/* Card 2: Never Sold or Shared */}
          <div className="glass-card p-6 sm:p-8 space-y-4">
            <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-glassEdge flex items-center justify-center text-frostGlow">
              <EyeOff className="w-5 h-5 text-blueprintBlue" />
            </div>
            <h2 className="font-display text-xl font-medium text-pureWhite">
              2. Zero Data Selling or Third-Party Ads
            </h2>
            <p className="text-xs sm:text-sm text-moonMist leading-relaxed">
              Unlike traditional financial portals and loan aggregators:
            </p>
            <ul className="space-y-2.5 text-xs text-moonMist pt-1">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-positiveMint mt-0.5 flex-shrink-0" />
                <span><strong>No Commercial Sale:</strong> We never sell, rent, license, or monetize your financial logs with third-party advertisers, brokers, or data brokers.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-positiveMint mt-0.5 flex-shrink-0" />
                <span><strong>No Hard Credit Bureau Pulls:</strong> We never ping CIBIL, Experian, or Equifax behind your back. Your credit inquiry history remains completely untouched.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-positiveMint mt-0.5 flex-shrink-0" />
                <span><strong>Zero Sponsor Bias:</strong> Loan eligibility evaluations are calculated purely mathematically based on RBI safety ratios, not sponsored commissions.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Detailed Breakdown: Local vs Database Storage */}
        <div className="glass-plate p-6 sm:p-8 mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-glassEdge flex items-center justify-center text-frostGlow">
              <Cpu className="w-5 h-5 text-voidViolet" />
            </div>
            <div>
              <h2 className="font-display text-xl font-medium text-pureWhite">
                3. Local Storage vs. Database Server Storage
              </h2>
              <p className="text-xs text-fogVeil font-mono">
                Understanding what stays on your device vs what is synced
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="bg-canvas/50 border border-glassEdge rounded-card p-5 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-mono text-blueprintBlue uppercase tracking-wider">
                <Server className="w-3.5 h-3.5" />
                <span>Saved to Secure Cloud Database</span>
              </div>
              <p className="text-xs text-moonMist leading-relaxed">
                To allow you to log in from multiple devices without losing your progress, the following is saved to your hosted PostgreSQL database:
              </p>
              <ul className="space-y-1.5 text-xs text-fogVeil">
                <li>• Your account profile and hashed login password</li>
                <li>• Your logged transactions and category assignments</li>
                <li>• Your active savings goals and EMI schedule</li>
                <li>• Your optional email address if you subscribed to updates</li>
              </ul>
            </div>

            <div className="bg-canvas/50 border border-glassEdge rounded-card p-5 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-mono text-positiveMint uppercase tracking-wider">
                <Cpu className="w-3.5 h-3.5" />
                <span>Kept Only in Your Browser Session</span>
              </div>
              <p className="text-xs text-moonMist leading-relaxed">
                Calculators and temporary scratchpad tools operate in client memory without writing to database storage:
              </p>
              <ul className="space-y-1.5 text-xs text-fogVeil">
                <li>• <strong>Tax Regime Calculator</strong> slider/income test inputs</li>
                <li>• <strong>FD & RD Simulator</strong> maturity yield calculations</li>
                <li>• What-if temporary goal slider adjustments</li>
                <li>• Uploaded raw screenshot image data (discarded immediately after parsing)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 4: Factual Encryption & Security */}
        <div className="glass-card p-6 sm:p-8 space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-glassEdge flex items-center justify-center text-frostGlow">
              <Lock className="w-5 h-5 text-positiveMint" />
            </div>
            <div>
              <h2 className="font-display text-xl font-medium text-pureWhite">
                4. Real & Factual Encryption Standards
              </h2>
              <p className="text-xs text-fogVeil font-mono">
                Exact security controls active in our current infrastructure
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-card bg-white/[0.02] border border-glassEdge space-y-2">
              <div className="flex items-center space-x-1.5 text-xs font-mono text-pureWhite font-medium">
                <KeyRound className="w-3.5 h-3.5 text-frostGlow" />
                <span>TLS 1.3 / HTTPS</span>
              </div>
              <p className="text-[11px] text-fogVeil leading-relaxed">
                100% of network requests between your browser, Vercel edge routes, and database APIs are encrypted in transit using strict HTTPS certificates.
              </p>
            </div>

            <div className="p-4 rounded-card bg-white/[0.02] border border-glassEdge space-y-2">
              <div className="flex items-center space-x-1.5 text-xs font-mono text-pureWhite font-medium">
                <Database className="w-3.5 h-3.5 text-blueprintBlue" />
                <span>AES-256 Storage</span>
              </div>
              <p className="text-[11px] text-fogVeil leading-relaxed">
                Database records on Supabase / PostgreSQL are stored on volumes protected with industry-standard AES-256 hardware encryption at rest.
              </p>
            </div>

            <div className="p-4 rounded-card bg-white/[0.02] border border-glassEdge space-y-2">
              <div className="flex items-center space-x-1.5 text-xs font-mono text-pureWhite font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-positiveMint" />
                <span>Ephemeral Memory OCR</span>
              </div>
              <p className="text-[11px] text-fogVeil leading-relaxed">
                Receipt screenshots are processed within transient serverless RAM to extract text. The image binary is never saved or indexed on disk.
              </p>
            </div>
          </div>
        </div>

        {/* Questions Footer CTA */}
        <div className="mt-12 text-center text-xs text-fogVeil font-mono">
          <span>Questions about our security implementation? View our open-source codebase or verify our architecture standards.</span>
        </div>
      </main>

      <Footer />
    </div>
  );
}
