# Tech Stack: FinAccess — Financial Inclusion Platform

**Project type:** DPUX Sem 5 project
**Doc owner:** Ldrago

---

## 1. Frontend

| Tool | Purpose |
|---|---|
| **Next.js** | Core framework — handles both the landing/marketing pages and the dashboard app in one codebase |
| **React** | Component layer, comes bundled with Next.js |
| **Tailwind CSS** | Styling — fast to build with, matches your usual workflow |
| **Recharts** | Charting library for the spending breakdown, health score visualization, and goal progress bars — simpler API than Chart.js/D3 for dashboard-style charts |
| **react-hook-form** | Handles multi-field forms cleanly (income entry, loan eligibility inputs) |
| **Zod** | Schema validation for financial input data (income, expense amounts, etc.) |

---

## 2. Backend

| Tool | Purpose |
|---|---|
| **Next.js API routes** | Backend logic lives in the same project — no need for a separate Express server at this scale |
| **Prisma** | ORM — manages database schema, migrations, and queries |

---

## 3. Database

| Tool | Purpose |
|---|---|
| **PostgreSQL** | Primary database — better fit than MongoDB here since financial data (transactions, goals, loan rules) is inherently relational: users have many transactions, transactions belong to categories, goals track against income. Prisma + Postgres makes the health-score calculation queries much cleaner |
| **Neon** or **Supabase** | Free-tier hosted Postgres instance, integrates easily with Prisma + Vercel |

*(If you'd rather stick with MongoDB for consistency with your other projects, it'll still work — just less natural for this kind of tabular, relational financial data.)*

---

## 4. Authentication

| Tool | Purpose |
|---|---|
| **NextAuth.js (Auth.js)** | Simple email/credentials-based login — no need for full OAuth setup for a college demo |

---

## 5. Core Logic

| Tool | Purpose |
|---|---|
| **Plain server-side TypeScript functions** | Financial Health Score formula and loan eligibility estimator — rule-based, weighted calculations. No ML/AI needed, keeps it fully explainable in your viva |

---

## 6. Hosting / Deployment

| Tool | Purpose |
|---|---|
| **Vercel** | Hosts the Next.js frontend + API routes |
| **Neon / Supabase** | Hosts the Postgres database |

---

## 7. Summary Table

| Layer | Choice |
|---|---|
| Framework | Next.js + React |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Forms | react-hook-form + Zod |
| Backend | Next.js API routes |
| ORM | Prisma |
| Database | PostgreSQL (Neon/Supabase) |
| Auth | NextAuth.js |
| Hosting | Vercel |

---

## 8. Why This Stack

- **One codebase** — frontend and backend live together in Next.js, simpler to manage and demo
- **Relational data fits the domain** — transactions, goals, and loan products naturally map to related tables, which Postgres + Prisma handle better than a document store
- **No unnecessary complexity** — rule-based scoring instead of ML, credentials auth instead of full OAuth — keeps the build achievable in project timelines and easy to explain in a viva
- **Free-tier friendly** — Vercel + Neon/Supabase covers hosting and DB at zero cost for a college project
