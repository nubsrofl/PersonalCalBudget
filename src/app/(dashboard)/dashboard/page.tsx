'use client';
import React from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { RollingWeek } from '@/components/RollingWeek';
import { PayoffSimulator } from '@/components/PayoffSimulator';

export default function DashboardPage() {
  const today = dayjs();
  return (
    <main className="space-y-6">
      <nav className="flex gap-3 text-sm flex-wrap">
        <Link className="btn" href="/dashboard/bills">Bills</Link>
        <Link className="btn" href="/dashboard/debts">Debts</Link>
        <Link className="btn" href="/dashboard/paychecks">Paychecks</Link>
        <Link className="btn" href="/dashboard/cashflow">Cash-flow</Link>
        <Link className="btn" href="/dashboard/strategies">Strategies</Link>
        <Link className="btn" href="/dashboard/connections">Connections</Link>
        <Link className="btn" href="/dashboard/transactions">Transactions</Link>
        <form action="/api/calendar/google/sync" method="post"><button className="btn">Import Google Calendar</button></form>
      </nav>
      <div className="grid-2">
        <section className="card">
          <h2 className="text-lg font-semibold mb-2">This Week (Today-first)</h2>
          <RollingWeek date={today.toDate()} events={[]} bills={[]} />
        </section>
        <section className="card">
          <h2 className="text-lg font-semibold mb-2">Minimum-only Payoff (Demo)</h2>
          <PayoffSimulator />
        </section>
      </div>
    </main>
  );
}
