"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Wallet, Mail, Lock, User, ArrowRight, Eye, EyeOff, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";

// Inner component that uses useSearchParams — must be inside <Suspense>
function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Already signed in → go to dashboard
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setError("");
    setSuccess("");
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: email.toLowerCase().trim(),
        password,
        redirect: false,
      });
      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: email.toLowerCase().trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Sign up failed. Please try again.");
        return;
      }
      setSuccess("Account created! Signing you in…");
      const result = await signIn("credentials", {
        email: email.toLowerCase().trim(),
        password,
        redirect: false,
      });
      if (result?.error) {
        setError(result.error);
        setSuccess("");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="min-h-screen bg-blueprint-grid flex items-center justify-center">
        <div className="glass-plate p-8 flex flex-col items-center space-y-4">
          <div className="w-6 h-6 border-2 border-frostGlow border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-fogVeil font-mono">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blueprint-grid flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <div className="flex items-center space-x-2.5 mb-8">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blueprintBlue/30 to-voidViolet/30 border border-glassEdge flex items-center justify-center">
          <Wallet className="w-5 h-5 text-frostGlow" />
        </div>
        <span className="font-display text-xl font-semibold text-pureWhite tracking-tight">FinAccess</span>
      </div>

      {/* Card */}
      <div className="glass-plate w-full max-w-md p-8 space-y-6">
        {/* Tab switcher */}
        <div className="flex bg-black/20 rounded-lg p-1 gap-1">
          <button
            onClick={() => { setTab("signin"); resetForm(); }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              tab === "signin"
                ? "bg-glassPlate text-pureWhite shadow-sm border border-glassEdge"
                : "text-fogVeil hover:text-moonMist"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab("signup"); resetForm(); }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              tab === "signup"
                ? "bg-glassPlate text-pureWhite shadow-sm border border-glassEdge"
                : "text-fogVeil hover:text-moonMist"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Heading */}
        <div>
          <h1 className="font-display text-xl font-semibold text-pureWhite">
            {tab === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-xs text-fogVeil mt-1 font-mono">
            {tab === "signin"
              ? "Sign in to access your financial dashboard"
              : "Your data is yours alone — fully isolated per account"}
          </p>
        </div>

        {/* Error/success banners */}
        {error && (
          <div className="flex items-start space-x-2.5 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-300 font-mono">{error}</p>
          </div>
        )}
        {success && (
          <div className="flex items-start space-x-2.5 bg-positiveMint/10 border border-positiveMint/30 rounded-lg px-4 py-3">
            <CheckCircle2 className="w-4 h-4 text-positiveMint flex-shrink-0 mt-0.5" />
            <p className="text-xs text-positiveMint font-mono">{success}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={tab === "signin" ? handleSignIn : handleSignUp} className="space-y-4">
          {tab === "signup" && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-fogVeil uppercase tracking-wider">Your Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fogVeil" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Aisha Sharma"
                  className="w-full bg-black/30 border border-glassEdge rounded-lg pl-10 pr-4 py-2.5 text-sm text-pureWhite placeholder:text-fogVeil/50 focus:outline-none focus:border-frostGlow/60 transition-colors"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-fogVeil uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fogVeil" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aisha@example.com"
                required
                className="w-full bg-black/30 border border-glassEdge rounded-lg pl-10 pr-4 py-2.5 text-sm text-pureWhite placeholder:text-fogVeil/50 focus:outline-none focus:border-frostGlow/60 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-fogVeil uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fogVeil" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={tab === "signup" ? "Min. 6 characters" : "Your password"}
                required
                minLength={6}
                className="w-full bg-black/30 border border-glassEdge rounded-lg pl-10 pr-10 py-2.5 text-sm text-pureWhite placeholder:text-fogVeil/50 focus:outline-none focus:border-frostGlow/60 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-fogVeil hover:text-moonMist transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-pill w-full flex items-center justify-center space-x-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-frostGlow border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span className="text-sm font-medium">
                  {tab === "signin" ? "Sign In" : "Create Account"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Switch tab footer */}
        <p className="text-center text-xs text-fogVeil font-mono">
          {tab === "signin" ? (
            <>
              No account yet?{" "}
              <button onClick={() => { setTab("signup"); resetForm(); }} className="text-frostGlow hover:underline">
                Create one for free
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button onClick={() => { setTab("signin"); resetForm(); }} className="text-frostGlow hover:underline">
                Sign in
              </button>
            </>
          )}
        </p>

        {/* Trust badge */}
        <div className="flex items-center justify-center space-x-2 pt-2 border-t border-glassEdge">
          <ShieldCheck className="w-3.5 h-3.5 text-blueprintBlue" />
          <span className="text-[11px] font-mono text-fogVeil">Your data is isolated and never shared</span>
        </div>
      </div>
    </div>
  );
}

// Outer wrapper provides the required Suspense boundary for useSearchParams
export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-blueprint-grid flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-frostGlow border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AuthForm />
    </Suspense>
  );
}
