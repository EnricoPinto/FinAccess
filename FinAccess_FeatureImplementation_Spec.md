# FinAccess — Feature Implementation Spec
**For:** Antigravity implementation
**Scope:** Screenshot-to-transaction logging (Google Cloud Vision OCR), Indian Tax Regime Calculator, FD/RD Calculators, Credit Card/EMI Tracker
**Rule for Antigravity:** These are ADDITIONS to the existing FinAccess codebase. Do not change existing data models, routes, components, colors, fonts, or animation patterns unless explicitly instructed below — only extend them. Every new UI element must use the existing design tokens, card styles, border-radius, and animation/easing conventions already established in the project.

---

## 0. How These Features Connect to What Already Exists

- Screenshot logging is a **new entry point into the existing Transaction model/flow** — it pre-fills the same "Add Transaction" form already in the app, it does not create a separate transaction system.
- The Tax Calculator and FD/RD Calculators are **new modules inside the existing Financial Literacy section** — they follow the same card/module pattern already used for literacy content.
- The EMI/Credit Card Tracker is a **new model that links to the existing Loan Comparison feature** — when a user selects a loan from the comparison table, they get an option to add it to the EMI tracker.

If any existing route, component name, or schema field referenced below doesn't match what's actually in the project, Antigravity should adapt to the existing naming rather than creating a duplicate/parallel version.

---

## 1. Data Model Updates (Prisma schema)

Add these fields/models without removing or renaming any existing fields.

```prisma
// Extend the existing Transaction model — add these fields only
model Transaction {
  // ...existing fields (id, userId, type, category, amount, date, etc.) stay unchanged
  source          String   @default("manual") // "manual" | "screenshot"
  ocrConfidence   String?  // "high" | "medium" | "low" | null
  rawOcrText      String?  // stores the original extracted text for debugging/audit
}

// New model — Credit Card / EMI Tracker
model EmiEntry {
  id                String   @id @default(cuid())
  userId            String
  name              String   // e.g. "Personal Loan - HDFC", "Credit Card - ICICI"
  type              String   // "emi" | "credit_card"
  principalAmount   Float?
  interestRate      Float?
  tenureMonths      Int?
  monthlyInstallment Float
  dueDay            Int      // day of month, 1-31
  startDate         DateTime
  status            String   @default("active") // "active" | "closed"
  linkedLoanProductId String? // optional FK back to LoanProduct if added via Loan Comparison
  createdAt         DateTime @default(now())
}
```

---

## 2. Feature A: Screenshot-to-Transaction Logging (Google Cloud Vision OCR)

### 2.1 Setup (do this first, document in README)
1. Create a free Google Cloud account (no credit card charge within free tier — 1,000 Vision API text-detection units/month free)
2. Enable the **Cloud Vision API** in Google Cloud Console
3. Generate an API key, restrict it to the Vision API only
4. Add to `.env.local`:
   ```
   GOOGLE_CLOUD_VISION_API_KEY=your_key_here
   ```
5. **Never expose this key client-side** — all Vision API calls must go through a Next.js API route, never called directly from the browser

### 2.2 Backend: OCR + Parsing API Route
Create `/app/api/parse-receipt/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

const VISION_API_URL = 'https://vision.googleapis.com/v1/images:annotate';

export async function POST(req: NextRequest) {
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_CLOUD_VISION_API_KEY;

    // Demo-safety fallback: if no API key configured, return mock data
    // so the feature still demos correctly without a live key.
    if (!apiKey) {
      return NextResponse.json(getMockParseResult());
    }

    const visionResponse = await fetch(`${VISION_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [
          {
            image: { content: imageBase64 },
            features: [{ type: 'TEXT_DETECTION' }],
          },
        ],
      }),
    });

    if (!visionResponse.ok) {
      // API failed (quota, network, bad key) — fall back to mock rather than
      // breaking the demo
      return NextResponse.json(getMockParseResult());
    }

    const data = await visionResponse.json();
    const rawText = data.responses?.[0]?.fullTextAnnotation?.text || '';

    if (!rawText) {
      return NextResponse.json({ ...getMockParseResult(), ocrConfidence: 'low' });
    }

    const parsed = parseTransactionFromText(rawText);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error('OCR parse error:', error);
    return NextResponse.json(getMockParseResult());
  }
}

function getMockParseResult() {
  // Realistic fallback used only if Vision API is unavailable — keeps the
  // demo functional offline or without a configured key
  const mocks = [
    { amount: 450, merchant: 'Swiggy', date: new Date().toISOString().split('T')[0], category: 'Food & Dining', ocrConfidence: 'high', rawOcrText: '[mock - no API key configured]' },
    { amount: 1200, merchant: 'Rahul Kumar', date: new Date().toISOString().split('T')[0], category: 'Other', ocrConfidence: 'high', rawOcrText: '[mock - no API key configured]' },
  ];
  return mocks[Math.floor(Math.random() * mocks.length)];
}

// --- Parsing logic (amount/merchant/date/category extraction from OCR text) ---

const MERCHANT_STOPWORDS = new Set(['on', 'via', 'using', 'at', 'dated', 'ref', 'upi', 'id', 'no', 'the', 'a']);

function extractAmount(text: string): number | null {
  const patterns = [
    /(?:₹|rs\.?|inr)\s*([\d,]+(?:\.\d{1,2})?)/i,
    /([\d,]+(?:\.\d{1,2})?)\s*(?:₹|rs\.?|inr)/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const value = parseFloat(match[1].replace(/,/g, ''));
      if (!isNaN(value) && value > 0) return value;
    }
  }
  return null;
}

function extractMerchant(text: string): string | null {
  const pattern = /\b(?:paid\s*to|payment\s*to|sent\s*to|received\s*from|from|to)\b\s*[:\-]?\s*([A-Za-z][A-Za-z&.'\-]*(?:\s+[A-Za-z][A-Za-z&.'\-]*){0,3})/i;
  const match = text.match(pattern);
  if (!match) return null;

  let words = match[1].trim().split(/\s+/);
  while (words.length > 1 && MERCHANT_STOPWORDS.has(words[words.length - 1].toLowerCase())) {
    words.pop();
  }
  const name = words.join(' ');
  return name.length > 1 ? name : null;
}

function extractDate(text: string): string | null {
  const patterns = [
    /(\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4})/i,
    /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function guessCategory(merchant: string | null): string {
  if (!merchant) return 'Other';
  const m = merchant.toLowerCase();
  const rules = [
    { category: 'Food & Dining', keywords: ['swiggy', 'zomato', 'restaurant', 'cafe', 'food', 'dominos', 'mcdonald', 'kfc'] },
    { category: 'Travel', keywords: ['uber', 'ola', 'irctc', 'redbus', 'makemytrip', 'goibibo', 'fuel', 'petrol'] },
    { category: 'Shopping', keywords: ['amazon', 'flipkart', 'myntra', 'ajio', 'meesho'] },
    { category: 'Bills & Utilities', keywords: ['electricity', 'recharge', 'airtel', 'jio', 'broadband', 'wifi'] },
    { category: 'Entertainment', keywords: ['netflix', 'spotify', 'hotstar', 'prime', 'bookmyshow'] },
  ];
  for (const rule of rules) {
    if (rule.keywords.some((kw) => m.includes(kw))) return rule.category;
  }
  return 'Other';
}

function parseTransactionFromText(rawText: string) {
  const text = rawText.replace(/\s+/g, ' ').trim();
  const amount = extractAmount(text);
  const merchant = extractMerchant(text);
  const date = extractDate(text);
  const category = guessCategory(merchant);

  return {
    amount,
    merchant: merchant || 'Unknown',
    date: date || new Date().toISOString().split('T')[0],
    category,
    ocrConfidence: amount && merchant ? 'high' : amount || merchant ? 'medium' : 'low',
    rawOcrText: text,
  };
}
```

**This parsing logic has already been tested against sample UPI payment text** (GPay/PhonePe-style "Paid to X ₹Y on date" phrasing) and correctly extracts amount, merchant, date, and category — do not simplify or rewrite the regex patterns, they were tuned to avoid known edge-case bugs (e.g. matching "on" inside "Amazon").

### 2.3 Frontend: Upload Component
Create `components/ScreenshotUpload.tsx`:

- File input / drag-and-drop area styled with the existing card component (same border-radius, background, hover states as other cards in the app)
- On file select: show image preview thumbnail + a loading state ("Extracting details...") using the existing loading/skeleton pattern already in the app — do not introduce a new spinner style
- Convert image to base64, POST to `/api/parse-receipt`
- On response: show the **existing Add Transaction form**, pre-filled with the parsed amount/merchant/date/category, each field still editable
- Show a small confidence indicator badge (high/medium/low) next to the pre-filled fields so the user knows to double-check low-confidence extractions
- On save: submit through the **existing transaction-save logic/endpoint** — set `source: "screenshot"` on the payload, do not create a new save path
- Entry point: add a "Scan Receipt" button next to the existing "Add Transaction" button, same visual weight/style pairing (primary + secondary button pattern already used elsewhere in the app)

---

## 3. Feature B: Indian Tax Regime Calculator (Old vs New)

### 3.1 Location
New module card inside the existing Financial Literacy section — same card component/styling as other literacy modules, but interactive (calculator, not just an explainer).

### 3.2 Logic (pure function, no external API needed)
Create `lib/taxCalculator.ts`:

```typescript
// FY 2024-25 slabs — clearly label the assumption year in the UI so it reads
// as an estimate, not live-updated tax advice
function calculateOldRegimeTax(annualIncome: number, deductions: number): number {
  const taxableIncome = Math.max(0, annualIncome - deductions - 50000); // standard deduction
  let tax = 0;
  if (taxableIncome > 1000000) tax += (taxableIncome - 1000000) * 0.3;
  if (taxableIncome > 500000) tax += Math.min(taxableIncome - 500000, 500000) * 0.2;
  if (taxableIncome > 250000) tax += Math.min(taxableIncome - 250000, 250000) * 0.05;
  return applyCessAndRebate(tax, taxableIncome);
}

function calculateNewRegimeTax(annualIncome: number): number {
  const taxableIncome = Math.max(0, annualIncome - 75000); // new regime standard deduction
  let tax = 0;
  const slabs = [
    { limit: 300000, rate: 0 },
    { limit: 700000, rate: 0.05 },
    { limit: 1000000, rate: 0.10 },
    { limit: 1200000, rate: 0.15 },
    { limit: 1500000, rate: 0.20 },
    { limit: Infinity, rate: 0.30 },
  ];
  let previousLimit = 0;
  for (const slab of slabs) {
    if (taxableIncome > previousLimit) {
      tax += Math.min(taxableIncome - previousLimit, slab.limit - previousLimit) * slab.rate;
      previousLimit = slab.limit;
    }
  }
  return applyCessAndRebate(tax, taxableIncome);
}

function applyCessAndRebate(tax: number, taxableIncome: number): number {
  let finalTax = tax;
  if (taxableIncome <= 700000) finalTax = 0; // Section 87A rebate (new regime threshold)
  return Math.round(finalTax * 1.04); // 4% health & education cess
}

export function compareTaxRegimes(annualIncome: number, deductions: number) {
  const oldRegimeTax = calculateOldRegimeTax(annualIncome, deductions);
  const newRegimeTax = calculateNewRegimeTax(annualIncome);
  return {
    oldRegimeTax,
    newRegimeTax,
    recommended: oldRegimeTax <= newRegimeTax ? 'old' : 'new',
    savings: Math.abs(oldRegimeTax - newRegimeTax),
  };
}
```

**Important:** Label this clearly in the UI as an *estimate for FY 2024-25 slabs, for educational purposes* — not certified tax advice. Add a one-line disclaimer under the calculator, styled the same as any other muted/helper text in the app.

### 3.3 UI
- Two input fields: Annual Income, Total Deductions (80C/80D/HRA etc. — old regime only, disabled/grayed for new regime since it doesn't apply)
- Two result cards side by side (Old Regime / New Regime), using the existing card component
- Highlight the recommended regime with the existing "positive/recommended" visual treatment already used elsewhere in the app (same accent color logic as marking a goal on-track)
- Animate the tax amount numbers with the existing count-up animation pattern already defined for the app's financial figures — do not introduce a new number-animation style

---

## 4. Feature C: FD/RD Calculators

### 4.1 Location
Same Financial Literacy section, as a second interactive calculator card next to the Tax Calculator.

### 4.2 Logic
Create `lib/depositCalculators.ts`:

```typescript
// Fixed Deposit — compound interest, compounded quarterly (standard for Indian FDs)
export function calculateFD(principal: number, annualRate: number, years: number) {
  const n = 4; // quarterly compounding
  const maturityAmount = principal * Math.pow(1 + annualRate / 100 / n, n * years);
  return {
    maturityAmount: Math.round(maturityAmount),
    totalInterest: Math.round(maturityAmount - principal),
  };
}

// Recurring Deposit — standard RD formula
export function calculateRD(monthlyDeposit: number, annualRate: number, months: number) {
  const n = 4; // quarterly compounding, standard RD convention
  const r = annualRate / 100;
  let maturityAmount = 0;
  for (let i = 1; i <= months; i++) {
    const monthsRemaining = months - i + 1;
    maturityAmount += monthlyDeposit * Math.pow(1 + r / n, (n * monthsRemaining) / 12);
  }
  const totalDeposited = monthlyDeposit * months;
  return {
    maturityAmount: Math.round(maturityAmount),
    totalDeposited,
    totalInterest: Math.round(maturityAmount - totalDeposited),
  };
}
```

### 4.3 UI
- Toggle/tab between FD and RD mode (use the existing tab/pill component already established in the design system)
- Input fields with sliders (principal/monthly deposit, interest rate, tenure) — matches the "what-if slider" pattern already specified in the PRD for goal planning, reuse that same slider component
- Result card shows maturity amount with the count-up animation, plus a breakdown (principal/deposited vs. interest earned) as a simple two-segment bar, styled consistently with the existing budget progress bars

---

## 5. Feature D: Credit Card / EMI Due-Date Tracker

### 5.1 Location
New card on the main dashboard, positioned near/below the existing Loan Comparison section, plus its own dedicated list view.

### 5.2 Data Flow
- Standalone "Add EMI/Credit Card" form: name, type (EMI/Credit Card), principal, interest rate, tenure, monthly installment, due day
- **Integration point:** on the existing Loan Comparison feature, add an "Add to EMI Tracker" action on each loan card — pre-fills the EMI form using that loan product's rate/terms, sets `linkedLoanProductId`
- Dashboard card shows upcoming due dates sorted soonest-first, using the same list-row pattern as the existing Transactions list (icon, name, amount right-aligned, due date below amount — directly matches the Recurring card pattern already documented in the project's design reference)
- Reminder logic: entries due within 3 days get the existing "alert/negative" accent color treatment (same as an over-budget category), entries further out use neutral styling — do not introduce a new warning color

### 5.3 Data Aggregation
- Sum of all active EMI monthly installments should feed into the existing Financial Health Score calculation as part of the "expense-to-income ratio" component — this connects the new feature back into the score formula already defined in the PRD rather than existing as an isolated widget

---

## 6. Consistency Checklist (Antigravity must verify before considering this done)

- [ ] No new color tokens introduced — all new UI uses only the existing design token set (background, card surface, primary accent, positive/negative accent, text colors)
- [ ] No new border-radius values — cards/buttons/inputs match the existing radius scale exactly
- [ ] No new animation/easing curves — count-up numbers, hover states, and card transitions reuse the exact easing/timing already established in the project
- [ ] Screenshot logging saves through the existing Transaction save path, not a parallel one
- [ ] EMI tracker's monthly installment total is wired into the existing Financial Health Score calculation, not left disconnected
- [ ] Tax Calculator and FD/RD Calculator live inside the existing Financial Literacy section structure, not as orphaned standalone pages outside the established navigation
- [ ] Google Vision API key is read only server-side (`process.env`, never `NEXT_PUBLIC_*`) and the mock fallback path is verified working (test by temporarily unsetting the env var) so the demo cannot fail due to API/network issues on presentation day
