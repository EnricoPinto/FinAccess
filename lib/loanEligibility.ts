export interface LoanUserProfile {
  monthlyIncome: number;
  existingObligations: number;
  age: number;
}

export interface LoanProductItem {
  id: string;
  name: string;
  category: string;
  minInterestRate: number;
  maxInterestRate: number;
  minIncome: number;
  maxAmount: number;
  tenureMonths: number;
  provider: string;
  description: string;
}

export interface LoanEligibilityAssessment {
  product: LoanProductItem;
  eligible: boolean;
  statusTag: "Likely Eligible" | "Moderate Match" | "Higher Risk / Ineligible";
  statusColor: string;
  estimatedMaxAmount: number;
  estimatedMonthlyEMI: number;
  reason: string;
}

export interface EligibilitySummary {
  maxBorrowingCapacity: number;
  maxAvailableEMI: number;
  dtiRatio: number;
  evaluations: LoanEligibilityAssessment[];
}

export function evaluateLoanEligibility(
  profile: LoanUserProfile,
  products: LoanProductItem[]
): EligibilitySummary {
  const { monthlyIncome, existingObligations } = profile;
  const income = Math.max(monthlyIncome, 0);
  const obligations = Math.max(existingObligations, 0);

  // Debt-To-Income (DTI) limit (Standard max 50% income allocated to total debts)
  const maxAllowedDebt = income * 0.5;
  const maxAvailableEMI = Math.max(maxAllowedDebt - obligations, 0);
  const dtiRatio = income > 0 ? (obligations / income) * 100 : obligations > 0 ? 100 : 0;

  // Max borrowing capacity estimation based on 3-year average tenure at 12% APR
  // EMI formula: P = EMI * [ (1+r)^n - 1 ] / [ r * (1+r)^n ]
  const monthlyRate = 0.12 / 12;
  const defaultTenure = 36;
  const factor = (Math.pow(1 + monthlyRate, defaultTenure) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, defaultTenure));
  const maxBorrowingCapacity = Math.round(maxAvailableEMI * factor);

  const evaluations: LoanEligibilityAssessment[] = products.map((product) => {
    // Check minimum income threshold
    const meetsIncome = income >= product.minIncome;

    // Estimate EMI for max loan or product max
    const loanPrincipal = Math.min(product.maxAmount, Math.max(maxBorrowingCapacity, 0));
    const pRate = (product.minInterestRate / 100) / 12;
    const nMonths = product.tenureMonths || 36;
    
    let emi = 0;
    if (loanPrincipal > 0) {
      if (pRate === 0) {
        emi = Math.round(loanPrincipal / nMonths);
      } else {
        emi = Math.round(
          (loanPrincipal * pRate * Math.pow(1 + pRate, nMonths)) /
            (Math.pow(1 + pRate, nMonths) - 1)
        );
      }
    }

    let eligible = false;
    let statusTag: LoanEligibilityAssessment["statusTag"] = "Higher Risk / Ineligible";
    let statusColor = "#EF4444"; // Red / Warning
    let reason = "";

    if (income <= 0) {
      statusTag = "Higher Risk / Ineligible";
      statusColor = "#EF4444";
      reason = "Please record a positive gross monthly income to evaluate your loan borrowing capacity.";
    } else if (!meetsIncome) {
      statusTag = "Higher Risk / Ineligible";
      statusColor = "#EF4444";
      reason = `Required minimum monthly income is ₹${product.minIncome.toLocaleString("en-IN")}. Your recorded income is ₹${income.toLocaleString("en-IN")}.`;
    } else if (maxBorrowingCapacity <= 0 || maxAvailableEMI <= 0 || dtiRatio >= 50) {
      statusTag = dtiRatio > 50 ? "Higher Risk / Ineligible" : "Moderate Match";
      statusColor = dtiRatio > 50 ? "#EF4444" : "#F59E0B";
      reason = `Your current debt obligations (DTI: ${dtiRatio.toFixed(0)}%) leave no disposable margin for new loan EMIs under safe 50% DTI borrowing limits.`;
    } else if (maxAvailableEMI < emi) {
      statusTag = "Moderate Match";
      statusColor = "#F59E0B";
      reason = `Your available borrowing margin allows an EMI up to ₹${maxAvailableEMI.toLocaleString("en-IN")}/mo, which is below this loan tier's estimated EMI of ₹${emi.toLocaleString("en-IN")}/mo.`;
    } else {
      eligible = true;
      statusTag = "Likely Eligible";
      statusColor = "#14B8A6"; // Teal
      reason = `Your monthly cashflow of ₹${income.toLocaleString("en-IN")} comfortably meets the ₹${product.minIncome.toLocaleString("en-IN")} income threshold and EMI requirements.`;
    }

    return {
      product,
      eligible,
      statusTag,
      statusColor,
      estimatedMaxAmount: loanPrincipal,
      estimatedMonthlyEMI: emi,
      reason,
    };
  });

  return {
    maxBorrowingCapacity,
    maxAvailableEMI,
    dtiRatio,
    evaluations,
  };
}
