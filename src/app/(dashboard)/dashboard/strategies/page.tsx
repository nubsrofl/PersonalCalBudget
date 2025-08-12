'use client';
import React, { useMemo, useState } from 'react';
type Debt = { id?:string; name:string; apr:number; balance:number; minType:'flat'|'percent'; minValue:number; };
function monthStep(balance:number, apr:number, minType:'flat'|'percent', minValue:number, extra:number){
  const rate = apr/12;
  const interest = balance*rate;
  const min = minType==='percent'? Math.max(balance*minValue,25):minValue;
  const payment = Math.max(interest+1, min) + extra;
  const principal = Math.min(payment - interest, balance);
  return { interest, principal, payment, endBalance: balance - principal };
}
function payoffSchedule(debt:Debt, extra:number){
  let b = debt.balance, months=0, interest=0;
  while (b>0 && months<1200){
    const step = monthStep(b, debt.apr, debt.minType, debt.minValue, extra);
    b = step.endBalance; interest += step.interest; months++;
  }
  return { months, totalInterest: interest };
}
export default function StrategiesPage(){
  const [debts, setDebts] = useState<Debt[]>([]);
  const [mode, setMode] = useState<'snowball'|'avalanche'>('avalanche');
  const [extra, setExtra] = useState(100);
  React.useEffect(()=>{ fetch('/api/debts').then(r=>r.json()).then(setDebts); },[]);
  const ordered = useMemo(()=>{ const arr=[...debts]; if (mode==='snowball') arr.sort((a,b)=> a.balance - b.balance); else arr.sort((a,b)=> b.apr - a.apr); return arr; },[debts, mode]);
  const summary = useMemo(()=> ordered.map(d => ({ name: d.name, base: payoffSchedule(d, 0), withExtra: payoffSchedule(d, extra) })),[ordered, extra]);
  return (
    <main className="space-y-6">
      <section className="card">
        <h2 className="text-lg font-semibold mb-2">Debt Strategy</h2>
        <div className="flex items-center gap-3">
          <select className="input" value={mode} onChange={e=>setMode(e.target.value as any)}>
            <option value="avalanche">Avalanche (highest APR first)</option>
            <option value="snowball">Snowball (smallest balance first)</option>
          </select>
          <label className="text-sm">Extra per month:
            <input className="input" type="number" value={extra} onChange={e=>setExtra(parseFloat(e.target.value||'0'))}/>
          </label>
        </div>
      </section>
      <section className="card">
        <table className="w-full text-sm">
          <thead><tr><th>Debt</th><th>Payoff (min only)</th><th>Interest (min)</th><th>Payoff (with extra)</th><th>Interest (with extra)</th></tr></thead>
          <tbody>{summary.map((s,i)=>(<tr key={i}><td>{s.name}</td><td>{s.base.months} mo</td><td>${s.base.totalInterest.toFixed(2)}</td><td>{s.withExtra.months} mo</td><td>${s.withExtra.totalInterest.toFixed(2)}</td></tr>))}</tbody>
        </table>
      </section>
    </main>
  );
}
