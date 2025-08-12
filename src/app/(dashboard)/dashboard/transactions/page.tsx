'use client';
import React, { useEffect, useState } from 'react';
type Tx = { id:string; postedAt:string; amount:number; name:string; merchantName?:string; category?:string; type?:string; };
export default function TransactionsPage(){
  const [items, setItems] = useState<Tx[]>([]);
  const [importing, setImporting] = useState(false);
  async function load(){ const r = await fetch('/api/transactions'); if(r.ok){ setItems(await r.json()); } }
  useEffect(()=>{ load(); },[]);
  async function doImport(){ setImporting(true); await fetch('/api/plaid/transactions/import', { method: 'POST' }); await load(); setImporting(false); }
  return (
    <main className="space-y-6">
      <section className="card">
        <h2 className="text-lg font-semibold mb-2">Transactions</h2>
        <button className="btn btn-primary" onClick={doImport} disabled={importing}>{importing ? 'Importing...' : 'Import last 90 days'}</button>
      </section>
      <section className="card overflow-auto" style={{maxHeight: 480}}>
        <table className="w-full text-sm">
          <thead><tr><th>Date</th><th>Name</th><th>Merchant</th><th>Category</th><th>Type</th><th>Amount</th></tr></thead>
          <tbody>{items.map(tx=> (<tr key={tx.id}><td>{tx.postedAt.slice(0,10)}</td><td>{tx.name}</td><td>{tx.merchantName||''}</td><td>{tx.category||''}</td><td>{tx.type||''}</td><td>{(tx.amount>=0?'+':'') + Number(tx.amount).toFixed(2)}</td></tr>))}</tbody>
        </table>
      </section>
    </main>
  );
}
