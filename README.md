# FamilyFlow (Full Build)

A family-first calendar + bills/debts app with bank linking, cash-flow, and strategies.

## Features
- Next.js 14 + TypeScript + Prisma (Postgres)
- Auth: NextAuth (Credentials + Google OAuth)
- **Calendar**
  - Google import (read-only, 30 days): `/api/calendar/google/sync`
  - iCloud CalDAV discovery & write proxy
  - `/calendar` page with Day / Week (today-first) / Month
- **Bills & Debts**
  - CRUD UIs, ICS export for bills `/api/ics/bills`
  - Payoff simulator + Strategies (Snowball/Avalanche + extra payment)
- **Bank Linking (Plaid)**
  - Link flow, Liabilities import to Debts
  - Transactions import + review, simple classifier
  - Income anchor from payroll deposits
- **Cash-flow**
  - 30-day projection using bills, debt minimums, and paychecks (incl. anchored payroll)
- **Background jobs**
  - BullMQ queues scaffold (calendarSync, plaidSync)
- **Navigation**
  - Tabs (Dashboard / Calendar) + mobile bottom bar

## Run locally / on Proxmox
1. `cp .env.example .env` and fill values (set `NEXTAUTH_URL`, DB, Redis, Google, Plaid, iCloud).
2. `docker compose up --build -d`
3. Run DB migrations: `docker compose exec web npx prisma migrate dev --name init`
4. Open http://localhost:3000

## Notes
- Google OAuth redirect: `https://YOUR_HOST/api/auth/callback/google`
- Plaid keys (sandbox by default). After linking, use **Connections** page to import.
- iCloud requires an **app-specific password**; discovery endpoint helps find calendar home.
- Endpoints scope data to the authenticated user's household.

This is a production-leaning scaffold—safe to iterate and deploy behind your Cloudflare Tunnel.
