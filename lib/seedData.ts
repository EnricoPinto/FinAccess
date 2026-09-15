export const SAMPLE_LOAN_PRODUCTS = [
  {
    name: "HDFC Bank Personal Loan for Salaried",
    category: "Personal Loan",
    minInterestRate: 10.5,
    maxInterestRate: 15.5,
    minIncome: 25000,
    maxAmount: 4000000,
    tenureMonths: 60,
    provider: "HDFC Bank",
    description: "Instant digital paperless personal loan for salaried professionals with zero prepayment charges after 12 months.",
  },
  {
    name: "SBI Scholar & Ed-vantage Higher Education Loan",
    category: "Education Loan",
    minInterestRate: 8.2,
    maxInterestRate: 9.75,
    minIncome: 15000,
    maxAmount: 5000000,
    tenureMonths: 180,
    provider: "State Bank of India (SBI)",
    description: "Comprehensive course & hostel financing for premier institutes (IITs, IIMs, NITs) & abroad with 0.50% girl child discount.",
  },
  {
    name: "ICICI Bank Two-Wheeler & EV Super Loan",
    category: "Two-Wheeler Loan",
    minInterestRate: 9.4,
    maxInterestRate: 12.5,
    minIncome: 18000,
    maxAmount: 300000,
    tenureMonths: 36,
    provider: "ICICI Bank",
    description: "Up to 100% on-road financing for commuter bikes and electric two-wheelers with instant digital sanction.",
  },
  {
    name: "Axis Bank Shubh Aarambh Affordable Home Loan",
    category: "Home Loan",
    minInterestRate: 8.75,
    maxInterestRate: 9.65,
    minIncome: 30000,
    maxAmount: 7500000,
    tenureMonths: 240,
    provider: "Axis Bank",
    description: "Home loan with 12 EMI waivers upon consistent on-time repayments and zero prepayment penalty on floating rates.",
  },
  {
    name: "Tata Capital MSME & Freelancer Growth Credit",
    category: "Business Loan",
    minInterestRate: 12.0,
    maxInterestRate: 16.5,
    minIncome: 35000,
    maxAmount: 1500000,
    tenureMonths: 48,
    provider: "Tata Capital",
    description: "Collateral-free working capital loan for independent contractors, freelancers, and small business owners based on GST/bank inflows.",
  },
  {
    name: "Bajaj Finserv Insta Consumer Durable & Gadget Loan",
    category: "Consumer Durable Loan",
    minInterestRate: 0.0,
    maxInterestRate: 12.0,
    minIncome: 15000,
    maxAmount: 200000,
    tenureMonths: 24,
    provider: "Bajaj Finserv",
    description: "No-cost EMI card financing for laptops, work hardware, tablets, smartphones, and professional upskilling programs.",
  },
  {
    name: "Bank of Baroda Baroda Car Loan",
    category: "Auto Loan",
    minInterestRate: 8.85,
    maxInterestRate: 10.5,
    minIncome: 25000,
    maxAmount: 2500000,
    tenureMonths: 84,
    provider: "Bank of Baroda",
    description: "Up to 90% financing on new passenger cars with lowest processing fees and zero foreclosure charges on floating rates.",
  },
  {
    name: "SBI Pradhan Mantri Mudra Yojana (PMMY)",
    category: "Micro-Business Loan",
    minInterestRate: 8.4,
    maxInterestRate: 10.15,
    minIncome: 12000,
    maxAmount: 500000,
    tenureMonths: 60,
    provider: "State Bank of India (Govt Scheme)",
    description: "Government-backed collateral-free credit under Shishu & Kishor brackets for self-employed youth and early-stage ventures.",
  },
  {
    name: "ICICI Bank Instant Pre-Approved Gold Loan",
    category: "Gold / Secured Loan",
    minInterestRate: 9.25,
    maxInterestRate: 11.5,
    minIncome: 10000,
    maxAmount: 1000000,
    tenureMonths: 12,
    provider: "ICICI Bank",
    description: "30-minute instant liquidity against pledged gold jewelry with flexible bullet interest repayment options.",
  },
  {
    name: "Kotak Mahindra Bank Quick PayDay Bridge Loan",
    category: "Personal Loan",
    minInterestRate: 11.25,
    maxInterestRate: 14.5,
    minIncome: 20000,
    maxAmount: 150000,
    tenureMonths: 12,
    provider: "Kotak Mahindra Bank",
    description: "Short-term salary bridge for young earners to absorb mid-month emergencies without high-cost informal borrowing.",
  },
];

export const SAMPLE_LITERACY_MODULES = [
  {
    slug: "emergency-fund-basics",
    title: "What is an Emergency Fund?",
    category: "Emergency Funds",
    summary: "Why financial experts recommend saving 3-6 months of essential living expenses before investing.",
    readTimeMinutes: 3,
    content: `
An emergency fund is a dedicated pool of liquid cash set aside exclusively for unexpected financial shocks — such as medical emergencies, sudden job transition, or urgent vehicle/home repairs.

### Key Rules of an Emergency Fund:
1. **Separation**: Keep it in a separate high-yield savings account or liquid mutual fund so you aren't tempted to spend it on discretionary purchases.
2. **High Liquidity**: Do not lock emergency cash in volatile equities, real estate, or penalty-heavy fixed deposits.
3. **Calculation**: Total your essential monthly needs (Rent, Groceries, Utilities, Minimum Debt) and multiply by 3 to 6 months.

*Example*: If your essential monthly expenses equal ₹20,000, your target Emergency Fund is ₹60,000 to ₹1,20,000.
    `,
    keyTakeaways: JSON.stringify([
      "Covers 3 to 6 months of essential living expenses.",
      "Must be easily accessible in liquid bank savings or overnight funds.",
      "Protects you from high-interest personal loans and credit card debt in emergencies.",
    ]),
  },
  {
    slug: "debt-vs-emergency-priority",
    title: "Emergency Buffer vs Debt: What to Pay First?",
    category: "Emergency Funds",
    summary: "The practical roadmap: should you build savings or aggressively crush debt first?",
    readTimeMinutes: 3,
    content: `
A classic dilemma for young earners: *If I have ₹50,000 in credit card debt, should I save for an emergency fund or pay down debt?*

### The 3-Step Strategy:
1. **Step 1 — Build a Mini-Emergency Buffer**: Save a small starter fund of **₹15,000 to ₹25,000** first. Without this, any small flat tire or medical visit sends you right back to borrowing.
2. **Step 2 — Attack High-Interest Debt (> 12% APR)**: Use the **Debt Avalanche** method (pay highest interest rate first) to crush expensive credit card balances and payday loans.
3. **Step 3 — Expand to Full 6-Month Fund**: Once high-cost debt is gone, route those freed-up monthly EMI payments into your primary emergency reserve.
    `,
    keyTakeaways: JSON.stringify([
      "Start with a ₹15,000-₹25,000 starter buffer before aggressively paying debt.",
      "Credit card debt at 42% APR destroys wealth faster than any investment can grow.",
      "Debt Avalanche (highest interest rate first) saves the most money in interest.",
    ]),
  },
  {
    slug: "understanding-dti-ratio",
    title: "Understanding Debt-to-Income (DTI)",
    category: "Credit & Loans",
    summary: "Learn how banks evaluate your loan application and calculate your safe borrowing ceiling.",
    readTimeMinutes: 4,
    content: `
Your **Debt-to-Income (DTI)** ratio measures how much of your gross monthly income goes toward existing debt payments (credit card EMIs, education loans, bike loans).

### How DTI is Calculated:
**DTI = (Total Monthly Debt Payments / Gross Monthly Income) × 100**

### DTI Threshold Benchmarks:
- **0% - 20%**: Excellent. Lenders view you as very low risk and offer preferential interest rates.
- **21% - 35%**: Healthy range. Standard approvals with standard documentation.
- **36% - 50%**: Moderate risk. Lenders may cap your loan amount or demand a co-applicant.
- **> 50%**: High risk. Most formal banks will decline unsecured loan applications until existing debts are cleared.
    `,
    keyTakeaways: JSON.stringify([
      "DTI compares monthly debt obligations to gross monthly income.",
      "A DTI below 35% is ideal for qualifying for low-interest bank loans.",
      "Paying off small credit card balances quickly lowers your DTI ratio.",
    ]),
  },
  {
    slug: "credit-score-mechanics",
    title: "CIBIL & Credit Score Mechanics (300-900)",
    category: "Credit & Loans",
    summary: "How credit bureaus calculate your creditworthiness and why 750+ saves you lakhs in loan interest.",
    readTimeMinutes: 4,
    content: `
In India, bureaus like **CIBIL, Experian, and CRIF High Mark** generate a three-digit score between **300 and 900** summarizing your credit repayment behavior.

### What Makes Up Your Credit Score?
1. **Repayment History (35%)**: Have you paid all EMIs and credit card bills on or before the due date? A single 30-day late payment can slash 50-80 points.
2. **Credit Utilization Ratio (30%)**: The percentage of your credit card limit you use each month. Keeping this below 30% signals financial discipline.
3. **Credit History Length (15%)**: Older accounts build credibility. Don't close your oldest active credit card.
4. **Credit Mix (10%)**: A healthy blend of secured loans (home/car) and unsecured loans (credit card/personal).
5. **Hard Inquiries (10%)**: Applying for 5 credit cards in one week triggers multiple hard inquiries and flags you as credit-hungry.

*Pro-Tip*: A score above **750** typically unlocks 0.5% to 1.5% lower interest rates on home and personal loans.
    `,
    keyTakeaways: JSON.stringify([
      "Score ranges from 300 to 900; 750+ is the gold standard for bank approvals.",
      "Payment history (35%) and credit utilization (30%) drive 65% of your score.",
      "Keep credit card balance below 30% of your total credit limit.",
    ]),
  },
  {
    slug: "demystifying-apr",
    title: "Demystifying APR vs Headline Interest Rate",
    category: "Credit & Loans",
    summary: "Discover why the nominal interest rate isn't the true annual cost of your loan.",
    readTimeMinutes: 3,
    content: `
When comparing loans, many lenders advertise an attractive nominal interest rate like *"Personal Loans at 9.99%!"*. However, the **Annual Percentage Rate (APR)** reveals the true cost.

### What APR Includes:
- **Base Interest Rate**: The nominal interest cost on principal.
- **Processing Fees**: Typically 1% to 3% deducted upfront before disbursal.
- **GST & Documentation Fees**: 18% GST charged on all loan processing charges.
- **Mandatory Credit Insurance**: Often bundled automatically unless explicitly opted out.

*Rule of Thumb*: Always ask the bank for the **Key Fact Statement (KFS)** mandated by the Reserve Bank of India (RBI), which explicitly prints the APR.
    `,
    keyTakeaways: JSON.stringify([
      "APR reflects the total annual cost including upfront processing fees.",
      "A loan with 10% rate + 3% processing fee can have an APR over 12.5%.",
      "Always demand the RBI-mandated Key Fact Statement (KFS) before signing.",
    ]),
  },
  {
    slug: "credit-cards-smart-usage",
    title: "Credit Cards: Smart Leverage vs 42% APR Trap",
    category: "Credit & Cards",
    summary: "How to use the 45-day interest-free cycle, avoid the Minimum Due trap, and earn free rewards.",
    readTimeMinutes: 4,
    content: `
Credit cards are powerful tools when used as an interest-free charge card, but dangerous when treated as borrowed wealth.

### 1. The 45-Day Free Credit Window
Purchases made on day 1 of your billing cycle enjoy up to 45-50 days before payment is due. If you pay the **Total Statement Balance** in full by the due date, you pay **₹0 in interest**.

### 2. The Minimum Amount Due Trap
Credit card statements highlight the *"Minimum Amount Due"* (typically 5% of balance). If you pay only this:
- The remaining 95% incurs interest at **3.5% per month (42% to 48% annually)**.
- Interest is backdated to the transaction date, and the interest-free grace period is voided for all future purchases!

### Rules for Safe Card Usage:
- Set up **Auto-Debit for Total Amount Due** (not Minimum Due).
- Never withdraw cash from an ATM using a credit card (incurs immediate finance charges from day 1).
- Treat the credit card like a debit card: never swipe for what you don't already have in your savings account.
    `,
    keyTakeaways: JSON.stringify([
      "Always pay the Total Statement Due in full every month.",
      "Paying only the Minimum Due triggers 42%+ annual revolving interest.",
      "Never withdraw ATM cash using a credit card.",
    ]),
  },
  {
    slug: "50-30-20-rule",
    title: "The 50/30/20 Budgeting Rule",
    category: "Budgeting",
    summary: "A simple, stress-free formula to allocate your income without tracking every single rupee.",
    readTimeMinutes: 3,
    content: `
The 50/30/20 framework splits your net take-home pay into three intuitive buckets:

### 1. 50% for Needs (Essentials)
- Rent, PG fees, or housing maintenance
- Groceries and home meal prep
- Electricity, water, Wi-Fi, and mobile recharge
- Daily commute, metro, or fuel expenses

### 2. 30% for Wants (Discretionary)
- Weekend dining out and cafes
- Streaming subscriptions (Netflix, Spotify)
- Gadgets, hobbies, and new clothes
- Vacation and social outings

### 3. 20% for Savings & Debt Payoff
- Emergency fund contributions
- Monthly SIP in index funds or mutual funds
- Additional debt principal prepayments
    `,
    keyTakeaways: JSON.stringify([
      "50% Needs, 30% Wants, 20% Savings.",
      "Guarantees that at least one-fifth of every paycheck builds your future net worth.",
      "Gives you permission to enjoy 30% guilt-free on lifestyle.",
    ]),
  },
  {
    slug: "sip-and-power-of-compounding",
    title: "The Magic of SIP & Compound Interest",
    category: "Investing & Wealth",
    summary: "Why starting an automated ₹1,500 monthly investment in your early 20s beats starting big in your 30s.",
    readTimeMinutes: 4,
    content: `
Albert Einstein famously called compound interest the *"Eighth Wonder of the World"*. In personal finance, compounding works best when given **time**, not just large capital.

### Starting Early vs Starting Late:
- **Investor A (Starts at 22)**: Invests ₹2,500/month for 10 years (total invested: ₹3,00,000) and stops. At age 55 (at 12% annual return), this grows to **₹1.15 Crore**.
- **Investor B (Starts at 32)**: Invests ₹2,500/month for 23 years straight (total invested: ₹6,90,000). At age 55, this reaches **₹35 Lakhs**.

Even though Investor B invested more than double the money, Investor A ended with triple the wealth because their money had an extra 10 years to compound upon itself.

### The Power of SIP (Systematic Investment Plan):
- Automates investing directly on your salary credit day.
- Takes advantage of **Rupee Cost Averaging**: you automatically buy more mutual fund units when markets drop, and fewer when markets rise.
    `,
    keyTakeaways: JSON.stringify([
      "Time in the market matters far more than timing the market.",
      "Automating a ₹1,500-₹2,500 SIP on payday removes emotional bias.",
      "Compounding turns small monthly habits into life-changing corpus over 10-20 years.",
    ]),
  },
  {
    slug: "inflation-purchasing-power",
    title: "Inflation: The Silent Cash Destroyer",
    category: "Investing & Wealth",
    summary: "Why keeping all your savings in a traditional bank account silently erodes 5-6% of your purchasing power.",
    readTimeMinutes: 3,
    content: `
Most people think money left in a bank account is completely safe. While the nominal rupee balance won't drop, its **purchasing power** shrinks every single year due to **Inflation**.

### The Math of Erosion:
- If inflation is **6% per year**, an item costing ₹1,00,000 today will cost ₹1,79,000 in 10 years.
- If your bank savings account pays **2.7% to 3.0% interest**, your money is losing roughly **3% in real purchasing power** every 365 days.

### The 3-Tier Solution:
1. **Tier 1 (Daily Cash)**: 1 month of expenses in checking/savings for immediate bills.
2. **Tier 2 (Emergency Cushion)**: 3-6 months in a Liquid Mutual Fund or high-interest Sweep-in Fixed Deposit (paying 6.5% - 7.5%).
3. **Tier 3 (Wealth Growth)**: Long-term savings (5+ years) invested in low-cost Nifty 50 index funds or diversified equity mutual funds to generate inflation-beating 11-13% returns.
    `,
    keyTakeaways: JSON.stringify([
      "Bank savings accounts (3%) do not keep pace with 6% inflation.",
      "Keeping 100% of money in cash guarantees a slow loss of purchasing power.",
      "Divide capital into daily cash, liquid emergency buffer, and equity growth.",
    ]),
  },
  {
    slug: "insurance-foundations",
    title: "Health & Term Insurance: The Non-Negotiable Armor",
    category: "Insurance & Protection",
    summary: "Why pure protection plans must come before investing, and why corporate cover is never enough.",
    readTimeMinutes: 4,
    content: `
A single medical emergency can wipe out three years of disciplined savings in 48 hours. Insurance is not an investment to make profit; it is defensive armor to protect your hard-earned wealth.

### 1. Pure Term Life Insurance
- If anyone depends on your income (parents, spouse, siblings), you need a **Pure Term Insurance** plan.
- Rule of thumb: Cover should equal **10x to 15x your annual income**.
- Avoid *"Return of Premium"* or ULIP plans — they charge 4x higher fees for miserable 4-5% returns.

### 2. Comprehensive Health Insurance
- Even if your employer provides ₹3-5 Lakh corporate coverage, you can lose it instantly upon switching jobs or layoffs.
- Buy a personal standalone health policy (₹5-10 Lakh base) with a **Super Top-up policy (₹25-50 Lakhs)** for very low annual premiums in your 20s.
    `,
    keyTakeaways: JSON.stringify([
      "Insurance is defensive protection, never an investment vehicle.",
      "Buy pure Term Insurance (10-15x annual salary) with zero investment features.",
      "Always maintain personal health insurance independent of your employer.",
    ]),
  },
  {
    slug: "tax-saving-basics-new-regime",
    title: "Taxes in Plain English: New vs Old Tax Regime",
    category: "Taxes & Planning",
    summary: "How first-time earners can legally minimize income tax and maximize take-home salary.",
    readTimeMinutes: 4,
    content: `
In India, salaried earners can choose between two tax systems each financial year. Understanding which one fits your income saves thousands in deductions.

### 1. The New Tax Regime (Default & Simple)
- **Zero Tax up to ₹7.75 Lakhs**: Thanks to the ₹50,000 standard deduction and Section 87A rebate, salaried employees earning up to ₹7.75 Lakh/year pay **₹0 income tax**.
- **No Paperwork**: You do not need to submit rent receipts, LIC policies, or PPF proofs.
- Ideal for young earners who want flexibility without locking cash into 5-year lock-in schemes (like ELSS or tax-saving FDs).

### 2. The Old Tax Regime
- Offers deductions under **Section 80C** (up to ₹1.5L), **Section 80D** (health insurance up to ₹25k), and **HRA** (House Rent Allowance).
- Beneficial primarily if your annual income exceeds ₹10-12 Lakhs and you have substantial rent payments or home loan interest deductions.
    `,
    keyTakeaways: JSON.stringify([
      "Salaried earners with income under ₹7.75 Lakh pay zero tax under the New Regime.",
      "New Regime requires zero investment proofs or locked-in tax funds.",
      "Compare regimes annually on the Income Tax Portal calculator before filing.",
    ]),
  },
];
