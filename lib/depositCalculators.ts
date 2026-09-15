/**
 * Indian Banking Deposit Calculators
 * Standard quarterly compounding convention for Fixed Deposits and Recurring Deposits.
 */

export interface FdInput {
  principal: number;
  annualRate: number; // e.g., 7.1%
  tenureMonths: number;
  isSeniorCitizen?: boolean; // +0.5% p.a.
}

export interface DepositResult {
  principal: number;
  totalDeposit: number;
  interestEarned: number;
  maturityAmount: number;
  effectiveYield: number; // annualized yield
  tenureMonths: number;
  interestRate: number;
}

export interface RdInput {
  monthlyDeposit: number;
  annualRate: number;
  tenureMonths: number;
  isSeniorCitizen?: boolean;
}

/**
 * Fixed Deposit Calculator
 * Standard Indian banking quarterly compounding:
 * A = P * (1 + r / (4 * 100))^(4 * t)
 */
export function calculateFD(input: FdInput): DepositResult {
  const principal = Math.max(0, input.principal || 0);
  const tenureMonths = Math.max(1, input.tenureMonths || 1);
  const baseRate = Math.max(0, input.annualRate || 0);
  const effectiveRate = baseRate + (input.isSeniorCitizen ? 0.5 : 0);

  const tInYears = tenureMonths / 12;
  const quarterlyRate = effectiveRate / 400; // r / (4 * 100)
  const numQuarters = 4 * tInYears;

  const maturityAmount = principal * Math.pow(1 + quarterlyRate, numQuarters);
  const interestEarned = Math.max(0, maturityAmount - principal);
  const effectiveYield = principal > 0 && tInYears > 0 ? (interestEarned / (principal * tInYears)) * 100 : 0;

  return {
    principal,
    totalDeposit: principal,
    interestEarned: Math.round(interestEarned),
    maturityAmount: Math.round(maturityAmount),
    effectiveYield: Number(effectiveYield.toFixed(2)),
    tenureMonths,
    interestRate: effectiveRate,
  };
}

/**
 * Recurring Deposit Calculator
 * Indian standard: Each monthly installment compounds quarterly for its remaining period:
 * M = sum_{k=1}^n [ P * (1 + r/400)^((n - k + 1)/3) ]
 */
export function calculateRD(input: RdInput): DepositResult {
  const monthlyDeposit = Math.max(0, input.monthlyDeposit || 0);
  const tenureMonths = Math.max(1, input.tenureMonths || 1);
  const baseRate = Math.max(0, input.annualRate || 0);
  const effectiveRate = baseRate + (input.isSeniorCitizen ? 0.5 : 0);

  const quarterlyRate = effectiveRate / 400;
  let maturityAmount = 0;

  for (let k = 1; k <= tenureMonths; k++) {
    // Number of months this specific deposit stays invested
    const monthsInvested = tenureMonths - k + 1;
    const quarters = monthsInvested / 3;
    maturityAmount += monthlyDeposit * Math.pow(1 + quarterlyRate, quarters);
  }

  const totalDeposit = monthlyDeposit * tenureMonths;
  const interestEarned = Math.max(0, maturityAmount - totalDeposit);
  const tInYears = tenureMonths / 12;
  const effectiveYield = totalDeposit > 0 && tInYears > 0 ? (interestEarned / (totalDeposit * (tInYears / 2))) * 100 : 0;

  return {
    principal: monthlyDeposit,
    totalDeposit,
    interestEarned: Math.round(interestEarned),
    maturityAmount: Math.round(maturityAmount),
    effectiveYield: Number(effectiveYield.toFixed(2)),
    tenureMonths,
    interestRate: effectiveRate,
  };
}
