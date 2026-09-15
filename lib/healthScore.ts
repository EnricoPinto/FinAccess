export interface FinancialMetrics {
  monthlyIncome: number;
  totalExpenses: number;
  totalIncome: number;
  discretionaryExpenses: number;
  totalSaved: number;
  emergencyFundSaved: number;
}

export interface ComponentScore {
  name: string;
  weight: number;
  score: number; // 0-100
  metricValue: string;
  description: string;
  status: "strong" | "moderate" | "improve";
}

export interface HealthScoreResult {
  overallScore: number;
  totalScore: number;
  statusLabel: string;
  statusColor: string;
  summaryText: string;
  components: {
    savingsRate: ComponentScore;
    expenseRatio: ComponentScore;
    discretionaryRatio: ComponentScore;
    emergencyCoverage: ComponentScore;
  };
  plainEnglishInsights: string[];
}

export function calculateHealthScore(metrics: FinancialMetrics): HealthScoreResult {
  const {
    monthlyIncome = 0,
    totalIncome: metricTotalIncome = 0,
    totalExpenses = 0,
    discretionaryExpenses = 0,
    emergencyFundSaved = 0,
  } = metrics || {};

  const safeMonthlyIncome = Number(monthlyIncome) || 0;
  const safeTotalIncome = Number(metricTotalIncome) || 0;
  const safeExpenses = Math.max(Number(totalExpenses) || 0, 0);
  const safeDiscretionary = Math.max(Number(discretionaryExpenses) || 0, 0);
  const safeEmergencySaved = Math.max(Number(emergencyFundSaved) || 0, 0);

  const income = Math.max(safeTotalIncome || safeMonthlyIncome, 1); // prevent divide by zero
  const netSavings = Math.max(income - safeExpenses, 0);

  // 1. Savings Rate (40% weight)
  const rawSavingsRate = (netSavings / income) * 100;
  const savingsRate = isFinite(rawSavingsRate) ? Math.min(Math.max(rawSavingsRate, 0), 100) : 0;
  let savingsScore = 10;
  if (savingsRate >= 30) savingsScore = 100;
  else if (savingsRate >= 20) savingsScore = 85;
  else if (savingsRate >= 10) savingsScore = 65;
  else if (savingsRate > 0) savingsScore = 40;

  const savingsStatus: ComponentScore["status"] =
    savingsScore >= 80 ? "strong" : savingsScore >= 60 ? "moderate" : "improve";

  // 2. Expense-to-Income Ratio (25% weight)
  const rawExpenseRatio = (safeExpenses / income) * 100;
  const expenseRatio = isFinite(rawExpenseRatio) ? Math.max(rawExpenseRatio, 0) : 0;
  let expenseScore = 10;
  if (expenseRatio <= 50) expenseScore = 100;
  else if (expenseRatio <= 70) expenseScore = 80;
  else if (expenseRatio <= 85) expenseScore = 60;
  else if (expenseRatio <= 100) expenseScore = 35;

  const expenseStatus: ComponentScore["status"] =
    expenseScore >= 80 ? "strong" : expenseScore >= 60 ? "moderate" : "improve";

  // 3. Discretionary Spending % of Total Expenses (20% weight)
  const totalExpSafe = Math.max(safeExpenses, 1);
  const rawDiscretionaryPercent = safeExpenses > 0 ? (safeDiscretionary / totalExpSafe) * 100 : 0;
  const discretionaryPercent = isFinite(rawDiscretionaryPercent) ? Math.min(Math.max(rawDiscretionaryPercent, 0), 100) : 0;
  let discretionaryScore = 50; // Neutral default for unrecorded expenses
  if (safeExpenses > 0) {
    if (discretionaryPercent <= 20) discretionaryScore = 100;
    else if (discretionaryPercent <= 30) discretionaryScore = 85;
    else if (discretionaryPercent <= 40) discretionaryScore = 65;
    else if (discretionaryPercent <= 50) discretionaryScore = 45;
    else discretionaryScore = 20;
  }

  const discretionaryStatus: ComponentScore["status"] =
    discretionaryScore >= 80 ? "strong" : discretionaryScore >= 60 ? "moderate" : "improve";

  // 4. Emergency Fund Coverage in months (15% weight)
  // If totalExpenses is 0, estimate essential monthly baseline as 50% of income
  const monthlyExpSafe = safeExpenses > 0 ? safeExpenses : Math.max(income * 0.5, 1000);
  const rawMonthsCovered = safeEmergencySaved / monthlyExpSafe;
  const monthsCovered = isFinite(rawMonthsCovered) ? Math.max(rawMonthsCovered, 0) : 0;
  let emergencyScore = 20;
  if (monthsCovered >= 6) emergencyScore = 100;
  else if (monthsCovered >= 3) emergencyScore = 80;
  else if (monthsCovered >= 1) emergencyScore = 55;
  else if (monthsCovered > 0) emergencyScore = 35;

  const emergencyStatus: ComponentScore["status"] =
    emergencyScore >= 80 ? "strong" : emergencyScore >= 55 ? "moderate" : "improve";

  // Total weighted score
  const rawScore =
    savingsScore * 0.4 +
    expenseScore * 0.25 +
    discretionaryScore * 0.2 +
    emergencyScore * 0.15;

  const overallScore = Math.min(Math.max(Math.round(rawScore), 0), 100);

  let statusLabel = "Building Foundation";
  let statusColor = "#F59E0B";
  let summaryText = "You are taking the first steps to structure your finances. Small adjustments can yield quick progress.";

  if (overallScore >= 80) {
    statusLabel = "Thriving";
    statusColor = "#14B8A6";
    summaryText = "Excellent financial habits! You maintain a strong savings cushion and low overhead.";
  } else if (overallScore >= 65) {
    statusLabel = "Healthy & Stable";
    statusColor = "#2DD4BF";
    summaryText = "Solid financial grounding with regular savings and healthy spending boundaries.";
  } else if (overallScore >= 50) {
    statusLabel = "On Track";
    statusColor = "#818CF8";
    summaryText = "Balanced cash flow. Focus on building an emergency cushion and keeping wants in check.";
  } else {
    statusLabel = "Areas to Strengthen";
    statusColor = "#F59E0B";
    summaryText = "Your money is moving! Optimizing fixed expenses and starting a small savings routine will help you level up.";
  }

  // Plain English Insights
  const plainEnglishInsights: string[] = [
    safeExpenses > income
      ? `Expenses exceed income by ₹${(safeExpenses - income).toLocaleString("en-IN")}/mo (cashflow deficit).`
      : `You save ${savingsRate.toFixed(1)}% of your monthly income (₹${netSavings.toLocaleString("en-IN")}/mo).`,
    `Your essential & non-essential expenses take up ${expenseRatio.toFixed(1)}% of what you earn.`,
    `You spend ${discretionaryPercent.toFixed(1)}% of your expenses on discretionary/wants (₹${discretionaryExpenses.toLocaleString("en-IN")}).`,
    `Your emergency fund currently covers ${monthsCovered.toFixed(1)} months of essential living costs.`,
  ];

  return {
    overallScore,
    totalScore: overallScore,
    statusLabel,
    statusColor,
    summaryText,
    components: {
      savingsRate: {
        name: "Savings Rate",
        weight: 40,
        score: Math.round(savingsScore),
        metricValue: `${savingsRate.toFixed(1)}%`,
        description: "Percentage of monthly income saved after all expenses.",
        status: savingsStatus,
      },
      expenseRatio: {
        name: "Expense-to-Income",
        weight: 25,
        score: Math.round(expenseScore),
        metricValue: `${expenseRatio.toFixed(1)}%`,
        description: "How much of your earnings goes toward monthly obligations.",
        status: expenseStatus,
      },
      discretionaryRatio: {
        name: "Discretionary Spend",
        weight: 20,
        score: Math.round(discretionaryScore),
        metricValue: `${discretionaryPercent.toFixed(1)}%`,
        description: "Share of expenses spent on non-essential lifestyle & entertainment.",
        status: discretionaryStatus,
      },
      emergencyCoverage: {
        name: "Emergency Fund",
        weight: 15,
        score: Math.round(emergencyScore),
        metricValue: `${monthsCovered.toFixed(1)} mos`,
        description: "Months of living expenses backed by accessible savings.",
        status: emergencyStatus,
      },
    },
    plainEnglishInsights,
  };
}
