'use client';
import React, { useEffect, useState } from 'react';
type Bill = { id?: string; name: string; amount: number; recurrence: string; dueDay?: number | null; dueDate?: string | null; category?: string | null; autopay?: boolean; };
export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [form, setForm] = useState<Bill>({ name: '', amount: 0, recurrence: 'monthly', dueDay: 1, category: '', autopay: false });
  async function load() { const r = await fetch('/api/bills'); if(r.ok){ setBills(await r.json()); } }
  useEffect(() => { load(); }, []);
  async function createBill(e: React.FormEvent) { e.preventDefault(); await fetch('/api/bills', { method: 'POST', body: JSON.stringify(form) }); setForm({ name: '', amount: 0, recurrence: 'monthly', dueDay: 1, category: '', autopay: false }); load(); }
  async function remove(id: string) { await fetch(`/api/bills/${id}`, { method: 'DELETE' }); load(); }
  return (
    <main className="space-y-6">
      <section className="card">
        <h2 className="text-lg font-semibold mb-2">Bills</h2>
        <form onSubmit={createBill} className="grid grid-cols-2 gap-2">
          <input className="input" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
          <input className="input" placeholder="Amount" type="number" value={form.amount} onChange={e=>setForm({...form, amount:parseFloat(e.target.value||'0')})}/>
          <select className="input" value={form.recurrence} onChange={e=>setForm({...form, recurrence:e.target.value})}>
            <option value="monthly">Monthly</option><option value="biweekly">Biweekly</option><option value="weekly">Weekly</option>
          </select>
          <input className="input" placeholder="Due day (1-31)" type="number" value={form.dueDay||''} onChange={e=>setForm({...form, dueDay: parseInt(e.target.value||'0')})}/>
          <input className="input" placeholder="Category" value={form.category||''} onChange={e=>setForm({...form, category:e.target.value})}/>
          <label className="text-sm flex items-center gap-2"><input type="checkbox" checked={form.autopay||false} onChange={e=>setForm({...form, autopay:e.target.checked})}/> Autopay</label>
          <button className="btn btn-primary col-span-2">Add Bill</button>
        </form>
      </section>
      <section className="card">
        <table className="w-full text-sm">
          <thead><tr><th>Name</th><th>Amount</th><th>Recurrence</th><th>Due</th><th>Category</th><th></th></tr></thead>
          <tbody>{bills.map(b=>(<tr key={b.id}><td>{b.name}</td><td>${Number(b.amount).toFixed(2)}</td><td>{b.recurrence}</td><td>{b.dueDay||'-'}</td><td>{b.category||''}</td><td><button className="btn" onClick={()=>remove(b.id!)}>Delete</button></td></tr>))}</tbody>
        </table>
      </section>
    </main>
  );
}
