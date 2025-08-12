'use client';
import React, { useEffect, useState } from 'react';
declare global { interface Window { Plaid?: any } }
export default function ConnectionsPage(){
  const [linkToken, setLinkToken] = useState<string|undefined>();
  useEffect(()=>{
    const s = document.createElement('script');
    s.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js';
    s.async = true;
    s.onload = async () => {
      const r = await fetch('/api/plaid/createLinkToken', { method: 'POST' });
      const data = await r.json();
      setLinkToken(data.link_token);
    };
    document.body.appendChild(s);
    return () => { document.body.removeChild(s); };
  },[]);
  async function openLink(){
    if (!window.Plaid || !linkToken) return;
    const handler = window.Plaid.create({
      token: linkToken,
      onSuccess: async (public_token: string) => {
        await fetch('/api/plaid/exchange', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ public_token }) });
        alert('Plaid linked. Importing liabilities and transactions...');
        await fetch('/api/plaid/liabilities', { method: 'POST' });
        await fetch('/api/plaid/transactions/import', { method: 'POST' });
        alert('Done! Check Debts and Transactions.');
      },
      onExit: () => {}
    });
    handler.open();
  }
  return (
    <main className="space-y-6">
      <section className="card">
        <h2 className="text-lg font-semibold mb-2">Connections</h2>
        <p className="text-sm text-muted">Link your bank/credit card to import debts and transactions.</p>
        <button className="btn btn-primary mt-2" onClick={openLink} disabled={!linkToken}>Link with Plaid</button>
      </section>
    </main>
  );
}
