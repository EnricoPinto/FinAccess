# FinAccess — Institutional Financial Health & Literacy Platform

FinAccess is a modern financial inclusion web application tailored for early-career earners, providing real-time financial health scoring, debt-to-income (DTI) safety analysis, what-if goal simulators, and automated receipt-to-transaction logging.

---

## Getting Started (Local Development)

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation & Run
```bash
# Install dependencies
npm install

# Push local database schema (creates SQLite db in /prisma/dev.db)
npm run db:push

# Start development server on port 3005
npm run dev
```

Visit [http://localhost:3005](http://localhost:3005) to view the application.

### Environment Variables (Local)

Copy `.env.local.example` to `.env.local` and fill in your values:
```bash
cp .env.local.example .env.local
```

See `.env.local.example` for full documentation of each variable.

---

## Deploying to Vercel

### Step 1 — Set up a Production Database

FinAccess uses Prisma ORM. SQLite works locally but **does not work on Vercel** (no persistent disk). For production, switch to a managed PostgreSQL database:

1. Create a free database at [Neon](https://neon.tech) or [Supabase](https://supabase.com)
2. Copy your `DATABASE_URL` connection string (starts with `postgresql://...`)
3. In `prisma/schema.prisma`, change the datasource provider:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
4. Run migrations on your production database:
   ```bash
   npx prisma migrate deploy
   ```

### Step 2 — Deploy to Vercel

```bash
# Install Vercel CLI (optional)
npm i -g vercel

# Deploy
vercel deploy
```

Or connect your GitHub repo to [vercel.com](https://vercel.com) for automatic deployments on push.

### Step 3 — Configure Environment Variables on Vercel

In your Vercel project → **Settings → Environment Variables**, add:

| Variable | Value | Notes |
|---|---|---|
| `DATABASE_URL` | `postgresql://...` | Your production database connection string |
| `NEXTAUTH_SECRET` | `<random 32-char hex>` | Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `GEMINI_API_KEY` | `AIza...` | Free key from [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) |

> **Note**: Do NOT set `NEXTAUTH_URL` on Vercel — it is detected automatically from the deployment URL.

---

## Screenshot-to-Transaction Logging (OCR)

FinAccess includes a smart screenshot-to-transaction feature on the **Tracker** page ("Scan Receipt"). It automatically extracts transaction amount, merchant name, date, and spending category from uploaded UPI payment screenshots (Google Pay, PhonePe, Paytm, CRED).

### Option 1 (Recommended): Google AI Studio — 100% Free

1. Go to: **[https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)**
2. Sign in and click **"Create API key"**
3. Add to `.env.local`:
   ```env
   GEMINI_API_KEY=AIzaSyYourKeyHere
   ```
4. Restart dev server (`npm run dev`)

### Option 2: Google Cloud Vision API (Requires Cloud Billing)

```env
GOOGLE_CLOUD_VISION_API_KEY=AIzaSyYourKeyHere
```

### Fallback Mode

If no API key is set, FinAccess gracefully falls back to realistic mock transaction data — the upload flow remains fully testable without breaking the user experience. A server-side warning is logged to alert you that OCR keys are missing.

---

## Tech Stack

- **Framework**: Next.js 14.2.15 (App Router)
- **ORM**: Prisma (SQLite for dev, PostgreSQL for production)
- **Auth**: NextAuth.js
- **Charts**: Recharts
- **Styling**: Tailwind CSS + Vanilla CSS (custom design system)
- **Icons**: Lucide React
