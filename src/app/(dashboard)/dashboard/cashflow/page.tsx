'use client';
import React, { useEffect, useMemo, useState } from 'react';

type Bill = { name: string; amount: number; recurrence: string; dueDay?: number|null; };
type Debt = { name: string; minType: 'flat'|'percent'; minValue: number; apr: number; balance: number; dueDay: number; };
type Paycheck = { name: string; amount: number; cadence: 'weekly'|'biweekly'|'semimonthly'|'monthly'; daySpecifier: string; };

export default function CashflowPage() {
  const [starting, setStarting] = useState(1000);
  const [days, setDays] = useState<Date[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [paychecks, setPaychecks] = useState<Paycheck[]>([]);

  useEffect(() => {
    const now = new Date();
    const arr: Date[] = [];
    for (let i=0;i<30;i++) arr.push(new Date(now.getTime()+i*24*3600*1000));
    setDays(arr);
    (async()=>{
      const [b, d, p, inc] = await Promise.all([
        fetch('/api/bills').then(r=>r.json()),
        fetch('/api/debts').then(r=>r.json()),
        fetch('/api/paychecks').then(r=>r.json()),
        fetch('/api/income').then(r=>r.json())
      ]);
      setBills(b); setDebts(d); setPaychecks(p);
      if (inc?.anchorDate && inc?.amount) {
        const derived: any = { name: 'Anchored Payroll', amount: Number(inc.amount), cadence: 'biweekly', daySpecifier: 'anchor' };
        setPaychecks(prev => [...prev, derived]);
      }
    })();
  },[]);

  const rows = useMemo(()=>{
    let balance = starting;
    const out: { date: string; inflow: number; outflow: number; balance: number; notes: string[] }[] = [];
    days.forEach((date)=>{
      let inflow = 0, outflow = 0;
      const notes: string[] = [];
      for (const bill of bills) {
        if (bill.recurrence === 'monthly' && bill.dueDay && date.getDate() === bill.dueDay) {
          outflow += Number(bill.amount); notes.push(`Bill: ${bill.name}`);
        }
      }
      for (const debt of debts) {
        if (date.getDate() === debt.dueDay) {
          const minPayment = debt.minType === 'percent' ? Math.max(debt.balance * debt.minValue, 25) : debt.minValue;
          outflow += Number(minPayment); notes.push(`Debt min: ${debt.name}`);
        }
      }
      for (const p of paychecks) {
        const dow = ['sun','mon','tue','wed','thu','fri','sat'][date.getDay()];
        if (p.cadence === 'weekly' && p.daySpecifier.toLowerCase() === dow) { inflow += Number(p.amount); notes.push(`Paycheck: ${p.name}`); }
        if (p.cadence === 'biweekly' && p.daySpecifier.toLowerCase() === dow) { inflow += Number(p.amount); notes.push(`Paycheck: ${p.name}`); }
        if (p.cadence === 'semimonthly' && p.daySpecifier === '1st&15th' && (date.getDate()===1 || date.getDate()===15)) { inflow += Number(p.amount); notes.push(`Paycheck: ${p.name}`); }
        if (p.cadence === 'monthly' && /^\d{1,2}$/.test(p.daySpecifier) && date.getDate()===Number(p.daySpecifier)) { inflow += Number(p.amount); notes.push(`Paycheck: ${p.name}`); }
      }
      balance = balance + inflow - outflow;
      out.push({ date: date.toISOString().slice(0,10), inflow, outflow, balance, notes });
    });
    return out;
  }, [days, bills, debts, paychecks, starting]);

  return (
    <main className="space-y-6">
      <section className="card">
        <h2 className="text-lg font-semibold mb-2">30-day Cash-flow (v1)</h2>
        <label className="text-sm">Starting balance:
          <input className="input ml-2" type="number" value={starting} onChange={e=>setStarting(parseFloat(e.target.value||'0'))}/>
        </label>
      </section>
      <section className="card overflow-auto" style={{maxHeight: 420}}>
        <table className="w-full text-sm">
          <thead><tr><th>Date</th><th>Inflow</th><th>Outflow</th><th>Balance</th><th>Notes</th></tr></thead>
          <tbody>{rows.map((r,i)=>(<tr key={i}><td>{r.date}</td><td>${r.inflow.toFixed(2)}</td><td>${r.outflow.toFixed(2)}</td><td>${r.balance.toFixed(2)}</td><td>{r.notes.join(', ')}</td></tr>))}</tbody>
        </table>
      </section>
    </main>
  );
}
