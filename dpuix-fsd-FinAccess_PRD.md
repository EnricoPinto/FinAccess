# PRD: FinAccess — Financial Inclusion Platform

**Project type:** DPUX Sem 5 project (revised, per faculty feedback)
**Doc owner:** Ldrago
**Status:** Draft v1 — ready to vibe-code from

---

## 1. Problem Statement

Most people, especially first-time earners (students, young professionals, gig workers), don't have a clear picture of their own finances. They don't know:
- Where their money actually goes each month
- Whether they're saving enough, or saving at all
- What loans/financial products they're even eligible for
- How to read basic financial health indicators without a finance background

Banks and fintech apps either dump raw numbers (transaction lists) with no interpretation, or push products (loans, cards) without checking if the user actually qualifies or needs them. There's no simple, judgment-free way for an average person to see "here's my financial situation in plain English, and here's what I can realistically do about it."

**Who faces this:** Students, early-career professionals, and anyone without formal financial literacy — a large chunk of first-time earners in India specifically.

**Why it matters:** Poor financial visibility leads to under-saving, taking on unsuitable loans, and missing eligible benefits/products — compounding financial stress over time.

---

## 2. Goals

- Turn raw income/expense data into a single, understandable **Financial Health Score**
- Make savings and goal-planning feel achievable, not abstract
- Help users compare loan options and know what they actually qualify for, before applying anywhere
- Build financial literacy passively, through the product itself — not a separate "course"

**Non-goals (for MVP):**
- Actual bank account integration / live transaction syncing (too complex for a college project — use manual entry or mock data)
- Real loan applications or partnerships with lenders (simulate comparison only)
- Investment advice or portfolio management

---

## 3. Target User

Young, first-time earners (students with part-time income, fresh graduates, gig workers) who have some money coming in but no structured way to track, plan, or understand it.

**Primary persona:** "Aisha" — a 22-year-old with a part-time/freelance income, wants to start saving but doesn't know how much is realistic, and has no idea what loan/credit options she'd even qualify for if she needed one.

---

## 4. Core Features (MVP)

### 4.1 Income/Expense Tracking
- Manual entry of income and expenses, categorized (rent, food, discretionary, transport, etc.)
- Simple monthly view — no need for bank sync in MVP, mock/manual data is fine for a demo

### 4.2 Financial Health Dashboard
- A single **Financial Health Score** (e.g. 68/100) calculated from savings rate, expense-to-income ratio, discretionary spend %, and emergency fund coverage
- Plain-English breakdown under the score, e.g.:
  - "You spend 27% of your income on discretionary expenses"
  - "At your current savings rate, your emergency fund goal will take 8 months"
- Visual breakdown (simple bar/pie chart of spending categories)

### 4.3 Financial Goals & Savings Planning
- User sets a goal (e.g. "Emergency fund: ₹30,000", "New laptop: ₹60,000")
- App calculates time-to-goal based on current savings rate
- Simple "what if" slider: "If you saved ₹500 more/month, you'd hit this goal 2 months sooner"

### 4.4 Loan Comparison & Eligibility Estimation
- User inputs basic profile (income, existing obligations, age)
- App shows a comparison table of common loan types (personal loan, education loan, etc.) with mock/sample rates and eligibility criteria
- Simple eligibility estimator: "Based on your income, you're likely eligible for loans up to ₹X" (rule-based, not real underwriting — clearly labeled as an estimate)

### 4.5 Financial Literacy Modules
- Short, bite-sized explainer cards/modules (e.g. "What is an emergency fund?", "How credit scores work", "Reading a loan's APR")
- Triggered contextually — e.g. when a user sees "credit score" mentioned in their eligibility estimate, a "learn more" link surfaces the relevant module
- Not a separate course section — literacy content is woven into the dashboard experience

### 4.6 Personalized Recommendations
- Based on the user's data, surface 2-3 relevant suggestions, e.g.:
  - "Your discretionary spending is high — consider the 50/30/20 budgeting rule"
  - "You don't have an emergency fund yet — this should be your first goal"
  - "Based on your profile, a savings account with X% interest may suit you better than a fixed deposit"

---

## 5. User Flow (MVP)

1. **Onboard** → sign up → enter basic profile (income, rough monthly expenses) or import mock data
2. **Dashboard** → land on Financial Health Score with plain-English breakdown
3. **Track** → add/edit income and expense entries, categorized
4. **Set a goal** → create a savings goal, see time-to-goal projection
5. **Explore loans** → check eligibility estimate, compare mock loan options
6. **Learn** → tap into a literacy module surfaced contextually from the dashboard or eligibility section
7. **Get recommendations** → see personalized tips based on current financial data

---

## 6. Non-Functional Requirements

- **Clarity over completeness:** Every number shown should have a plain-English explanation next to it — no raw jargon without context
- **Non-judgmental tone:** Recommendations and scores should feel like guidance, not criticism (avoid red/alarming visuals for low scores — frame as "areas to improve")
- **Data privacy:** Financial data (even mock/manual) should be treated as sensitive — no unnecessary sharing features

---

## 7. Suggested Tech Stack (for vibe-coding an MVP)

- **Frontend:** Next.js + React + Tailwind CSS — dashboard-heavy, so lean on a charting library (Recharts or Chart.js) for the visual breakdown
- **Backend/DB:** MongoDB Atlas or PostgreSQL + Prisma (either works fine for this scale) — collections/tables: `users`, `transactions`, `goals`, `loanProducts` (mock data)
- **Auth:** Simple email/username-based login for MVP
- **Score calculation:** Handled server-side or client-side with a simple weighted formula (no ML needed for MVP — rule-based is fine and easier to explain in a viva)
- **Hosting:** Vercel

---

## 8. Data Model (Rough)

```
User {
  id, name, email, monthlyIncome
}

Transaction {
  id, userId, type (income|expense), category, amount, date
}

Goal {
  id, userId, name, targetAmount, currentAmount, targetDate
}

LoanProduct {
  id, name, type, interestRate, minIncome, maxAmount
}
```

---

## 9. Financial Health Score — Sample Formula (for demo purposes)

A simple weighted rule-based score (out of 100), combining:
- Savings rate (income saved vs. spent) — 40%
- Expense-to-income ratio — 25%
- Discretionary spending % — 20%
- Emergency fund coverage (months of expenses saved) — 15%

Each component scored 0-100 individually, then weighted and summed. Keep the formula simple and explainable — this will likely come up in your viva/demo Q&A.

---

## 10. Success Criteria (for the demo/pitch)

- User can input income/expenses and see them reflected in a dashboard
- Financial Health Score calculates correctly and updates with new data
- A goal can be created and shows an accurate time-to-goal estimate
- Loan comparison table displays with a working eligibility estimate
- At least one contextual literacy module is functional
- Dashboard is visually clear — a non-finance person should understand their score at a glance

---

## 11. Open Questions to Resolve While Building

- Should transaction entry be fully manual, or should you simulate "bank sync" with pre-loaded mock data for a faster demo?
- How many loan products/literacy modules are enough for a convincing demo (suggest 3-4 of each — don't over-build)?
- Should the eligibility estimator be rule-based only, or is there time to add a slightly smarter scoring logic?
