'use client';
import React, { useEffect, useState } from 'react';
type Debt = { id?: string; name: string; type: string; apr: number; balance: number; minType: 'flat' | 'percent'; minValue: number; dueDay: number; ownerId?: string | null; };
export default function DebtsPage() {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [form, setForm] = useState<Debt>({ name: '', type: 'credit_card', apr: 0.2399, balance: 0, minType: 'percent', minValue: 0.02, dueDay: 15 });
  async function load() { const r = await fetch('/api/debts'); if(r.ok){ setDebts(await r.json()); } }
  useEffect(() => { load(); }, []);
  async function createDebt(e: React.FormEvent) { e.preventDefault(); await fetch('/api/debts', { method: 'POST', body: JSON.stringify(form) }); setForm({ name: '', type: 'credit_card', apr: 0.2399, balance: 0, minType: 'percent', minValue: 0.02, dueDay: 15 }); load(); }
  async function remove(id: string) { await fetch(`/api/debts/${id}`, { method: 'DELETE' }); load(); }
  return (
    <main className="space-y-6">
      <section className="card">
        <h2 className="text-lg font-semibold mb-2">Debts</h2>
        <form onSubmit={createDebt} className="grid grid-cols-2 gap-2">
          <input className="input" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
          <select className="input" value={form.type} onChange={e=>setForm({...form, type:e.target.value})}>
            <option value="credit_card">Credit Card</option><option value="loan">Loan</option><option value="mortgage">Mortgage</option>
          </select>
          <input className="input" placeholder="APR (0.2399)" type="number" step="0.0001" value={form.apr} onChange={e=>setForm({...form, apr: parseFloat(e.target.value||'0')})}/>
          <input className="input" placeholder="Balance" type="number" value={form.balance} onChange={e=>setForm({...form, balance: parseFloat(e.target.value||'0')})}/>
          <select className="input" value={form.minType} onChange={e=>setForm({...form, minType: e.target.value as any})}>
            <option value="percent">Percent</option><option value="flat">Flat</option>
          </select>
          <input className="input" placeholder="Min Value (0.02 or $)" type="number" step="0.0001" value={form.minValue} onChange={e=>setForm({...form, minValue: parseFloat(e.target.value||'0')})}/>
          <input className="input" placeholder="Due day (1-31)" type="number" value={form.dueDay} onChange={e=>setForm({...form, dueDay: parseInt(e.target.value||'1')})}/>
          <button className="btn btn-primary col-span-2">Add Debt</button>
        </form>
      </section>
      <section className="card">
        <table className="w-full text-sm">
          <thead><tr><th>Name</th><th>Type</th><th>APR</th><th>Balance</th><th>Min</th><th>Due</th><th></th></tr></thead>
          <tbody>{debts.map(d=>(<tr key={d.id}><td>{d.name}</td><td>{d.type}</td><td>{Number(d.apr)}</td><td>${Number(d.balance).toFixed(2)}</td><td>{d.minType} {d.minValue}</td><td>{d.dueDay}</td><td><button className="btn" onClick={()=>remove(d.id!)}>Delete</button></td></tr>))}</tbody>
        </table>
      </section>
    </main>
  );
}
