'use client';
import React, { useEffect, useState } from 'react';
type Paycheck = { id?: string; name: string; amount: number; cadence: 'weekly'|'biweekly'|'semimonthly'|'monthly'; daySpecifier: string; };
export default function PaychecksPage() {
  const [items, setItems] = useState<Paycheck[]>([]);
  const [form, setForm] = useState<Paycheck>({ name: 'Paycheck', amount: 0, cadence: 'biweekly', daySpecifier: 'fri' });
  async function load() { const r = await fetch('/api/paychecks'); if(r.ok){ setItems(await r.json()); } }
  useEffect(() => { load(); }, []);
  async function createItem(e: React.FormEvent) { e.preventDefault(); await fetch('/api/paychecks', { method: 'POST', body: JSON.stringify(form) }); setForm({ name: 'Paycheck', amount: 0, cadence: 'biweekly', daySpecifier: 'fri' }); load(); }
  async function remove(id: string) { await fetch(`/api/paychecks/${id}`, { method: 'DELETE' }); load(); }
  return (
    <main className="space-y-6">
      <section className="card">
        <h2 className="text-lg font-semibold mb-2">Paycheck Templates</h2>
        <form onSubmit={createItem} className="grid grid-cols-2 gap-2">
          <input className="input" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
          <input className="input" placeholder="Net amount" type="number" value={form.amount} onChange={e=>setForm({...form, amount: parseFloat(e.target.value||'0')})}/>
          <select className="input" value={form.cadence} onChange={e=>setForm({...form, cadence: e.target.value as any})}>
            <option value="weekly">Weekly</option><option value="biweekly">Biweekly</option><option value="semimonthly">Semi-monthly</option><option value="monthly">Monthly</option>
          </select>
          <input className="input" placeholder="Day spec (fri | 1st&15th | 28)" value={form.daySpecifier} onChange={e=>setForm({...form, daySpecifier: e.target.value})}/>
          <button className="btn btn-primary col-span-2">Add Template</button>
        </form>
      </section>
      <section className="card">
        <table className="w-full text-sm">
          <thead><tr><th>Name</th><th>Amount</th><th>Cadence</th><th>Spec</th><th></th></tr></thead>
          <tbody>{items.map(p=>(<tr key={p.id}><td>{p.name}</td><td>${Number(p.amount).toFixed(2)}</td><td>{p.cadence}</td><td>{p.daySpecifier}</td><td><button className="btn" onClick={()=>remove(p.id!)}>Delete</button></td></tr>))}</tbody>
        </table>
      </section>
    </main>
  );
}
