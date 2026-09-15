/**
 * Indian Tax Regime Calculator (FY 2024-25)
 * Calculates tax liability under Old Regime and New Regime (revised post-July 2024 Budget).
 */

export interface TaxInput {
  grossIncome: number;
  section80C?: number; // max ₹1,50,000 (PPF, ELSS, EPF, Life Insurance)
  section80D?: number; // max ₹25,000 (Self/Family) + ₹25,000/50,000 (Parents)
  hraExemption?: number; // House Rent Allowance exempt amount
  otherDeductions?: number; // Other Chapter VI-A deductions
}

export interface TaxBreakdown {
  regime: "OLD" | "NEW";
  grossIncome: number;
  standardDeduction: number;
  deductions: number;
  taxableIncome: number;
  baseTax: number;
  rebate87A: number;
  taxAfterRebate: number;
  cess: number; // 4% Health & Education Cess
  totalTax: number;
  effectiveRate: number;
}

export interface TaxComparison {
  oldRegime: TaxBreakdown;
  newRegime: TaxBreakdown;
  recommended: "OLD" | "NEW" | "EQUAL";
  taxSavings: number;
}

export function calculateOldRegimeTax(input: TaxInput): TaxBreakdown {
  const gross = Math.max(0, input.grossIncome || 0);
  const standardDeduction = 50000;

  // Capped deductions
  const sec80C = Math.min(150000, Math.max(0, input.section80C || 0));
  const sec80D = Math.min(75000, Math.max(0, input.section80D || 0));
  const hra = Math.max(0, input.hraExemption || 0);
  const other = Math.max(0, input.otherDeductions || 0);

  const totalDeductions = standardDeduction + sec80C + sec80D + hra + other;
  const taxableIncome = Math.max(0, gross - totalDeductions);

  let baseTax = 0;
  if (taxableIncome > 1000000) {
    baseTax += (taxableIncome - 1000000) * 0.3;
    baseTax += 500000 * 0.2; // 5L to 10L @ 20% = 1,00,000
    baseTax += 250000 * 0.05; // 2.5L to 5L @ 5% = 12,500
  } else if (taxableIncome > 500000) {
    baseTax += (taxableIncome - 500000) * 0.2;
    baseTax += 250000 * 0.05;
  } else if (taxableIncome > 250000) {
    baseTax += (taxableIncome - 250000) * 0.05;
  }

  // Section 87A Rebate: if taxable income <= 5,00,000, rebate up to ₹12,500
  let rebate87A = 0;
  if (taxableIncome <= 500000) {
    rebate87A = baseTax;
  }

  const taxAfterRebate = Math.max(0, baseTax - rebate87A);
  const cess = Math.round(taxAfterRebate * 0.04);
  const totalTax = taxAfterRebate + cess;
  const effectiveRate = gross > 0 ? (totalTax / gross) * 100 : 0;

  return {
    regime: "OLD",
    grossIncome: gross,
    standardDeduction,
    deductions: sec80C + sec80D + hra + other,
    taxableIncome,
    baseTax,
    rebate87A,
    taxAfterRebate,
    cess,
    totalTax,
    effectiveRate: Number(effectiveRate.toFixed(2)),
  };
}

export function calculateNewRegimeTax(input: TaxInput): TaxBreakdown {
  const gross = Math.max(0, input.grossIncome || 0);
  // Budget 2024 revised standard deduction for salaried taxpayers under New Regime to ₹75,000
  const standardDeduction = 75000;
  const taxableIncome = Math.max(0, gross - standardDeduction);

  // FY 2024-25 Revised Slabs:
  // Up to ₹3,00,000: Nil
  // ₹3,00,001 - ₹7,00,000: 5%
  // ₹7,00,001 - ₹10,00,000: 10%
  // ₹10,00,001 - ₹12,00,000: 15%
  // ₹12,00,001 - ₹15,00,000: 20%
  // Above ₹15,00,000: 30%
  let baseTax = 0;
  if (taxableIncome > 1500000) {
    baseTax += (taxableIncome - 1500000) * 0.3;
    baseTax += 300000 * 0.2; // 12L to 15L (3L @ 20%) = 60,000
    baseTax += 200000 * 0.15; // 10L to 12L (2L @ 15%) = 30,000
    baseTax += 300000 * 0.1; // 7L to 10L (3L @ 10%) = 30,000
    baseTax += 400000 * 0.05; // 3L to 7L (4L @ 5%) = 20,000
  } else if (taxableIncome > 1200000) {
    baseTax += (taxableIncome - 1200000) * 0.2;
    baseTax += 200000 * 0.15;
    baseTax += 300000 * 0.1;
    baseTax += 400000 * 0.05;
  } else if (taxableIncome > 1000000) {
    baseTax += (taxableIncome - 1000000) * 0.15;
    baseTax += 300000 * 0.1;
    baseTax += 400000 * 0.05;
  } else if (taxableIncome > 700000) {
    baseTax += (taxableIncome - 700000) * 0.1;
    baseTax += 400000 * 0.05;
  } else if (taxableIncome > 300000) {
    baseTax += (taxableIncome - 300000) * 0.05;
  }

  // Section 87A Rebate: Under New Regime, if taxable income <= 7,00,000, rebate up to ₹25,000
  let rebate87A = 0;
  if (taxableIncome <= 700000) {
    rebate87A = baseTax;
  }

  const taxAfterRebate = Math.max(0, baseTax - rebate87A);
  const cess = Math.round(taxAfterRebate * 0.04);
  const totalTax = taxAfterRebate + cess;
  const effectiveRate = gross > 0 ? (totalTax / gross) * 100 : 0;

  return {
    regime: "NEW",
    grossIncome: gross,
    standardDeduction,
    deductions: 0, // In new regime, 80C/80D/HRA are forgone
    taxableIncome,
    baseTax,
    rebate87A,
    taxAfterRebate,
    cess,
    totalTax,
    effectiveRate: Number(effectiveRate.toFixed(2)),
  };
}

export function compareTaxRegimes(input: TaxInput): TaxComparison {
  const oldRegime = calculateOldRegimeTax(input);
  const newRegime = calculateNewRegimeTax(input);

  let recommended: "OLD" | "NEW" | "EQUAL" = "EQUAL";
  let taxSavings = 0;

  if (oldRegime.totalTax < newRegime.totalTax) {
    recommended = "OLD";
    taxSavings = newRegime.totalTax - oldRegime.totalTax;
  } else if (newRegime.totalTax < oldRegime.totalTax) {
    recommended = "NEW";
    taxSavings = oldRegime.totalTax - newRegime.totalTax;
  }

  return {
    oldRegime,
    newRegime,
    recommended,
    taxSavings,
  };
}
