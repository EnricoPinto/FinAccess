import { HealthScoreResult } from "./healthScore";

export interface Recommendation {
  id: string;
  title: string;
  category: "Savings" | "Budgeting" | "Credit" | "Emergency";
  description: string;
  actionText: string;
  actionHref: string;
  priority: "high" | "medium" | "low";
  iconName: string;
}

export function generateRecommendations(
  scoreData: HealthScoreResult,
  totalSaved: number
): Recommendation[] {
  const recs: Recommendation[] = [];

  // 1. Check Emergency Fund Coverage
  const emergencyScore = scoreData.components.emergencyCoverage.score;
  if (emergencyScore < 80) {
    recs.push({
      id: "rec-emergency-fund",
      title: "Build an Emergency Cushion First",
      category: "Emergency",
      description:
        "An emergency fund covering 3-6 months of expenses protects you from debt when surprise expenses arise. Set up an automated savings goal for ₹30,000.",
      actionText: "Set Emergency Goal",
      actionHref: "/goals",
      priority: "high",
      iconName: "ShieldAlert",
    });
  }

  // 2. Check Discretionary Spending
  const discretionaryScore = scoreData.components.discretionaryRatio.score;
  if (discretionaryScore < 70) {
    recs.push({
      id: "rec-discretionary-budget",
      title: "Apply the 50/30/20 Budgeting Rule",
      category: "Budgeting",
      description:
        "Over 30% of your expenses go toward discretionary spending. Allocating 50% to Needs, 30% to Wants, and 20% to Savings can save you ₹3,500+ monthly.",
      actionText: "Learn 50/30/20 Rule",
      actionHref: "/literacy?module=50-30-20-rule",
      priority: "high",
      iconName: "PieChart",
    });
  }

  // 3. Check Savings Rate
  const savingsScore = scoreData.components.savingsRate.score;
  if (savingsScore < 80) {
    recs.push({
      id: "rec-savings-boost",
      title: "Automate a ₹500 Monthly Savings Boost",
      category: "Savings",
      description:
        "Saving just ₹500 extra each month cuts your financial goal timelines down by up to 2 months. Try out our interactive 'What-If' goal slider.",
      actionText: "Test Savings Slider",
      actionHref: "/goals",
      priority: "medium",
      iconName: "TrendingUp",
    });
  }

  // 4. Check Credit / Loan Readiness
  recs.push({
    id: "rec-loan-eligibility",
    title: "Check Your Debt-to-Income & Loan Options",
    category: "Credit",
    description:
      "Before applying for any loan, know your realistic eligibility limit to avoid credit inquiries or taking on unmanageable EMIs.",
    actionText: "Compare Loan Products",
    actionHref: "/loans",
    priority: "low",
    iconName: "CreditCard",
  });

  return recs.slice(0, 3);
}
