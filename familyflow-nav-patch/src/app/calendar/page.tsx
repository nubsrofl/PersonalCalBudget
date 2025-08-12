'use client';
import React from 'react';
import dayjs from 'dayjs';
import { useSearchParams, useRouter } from 'next/navigation';
import { RollingWeek } from '@/components/RollingWeek';

function ViewSwitch() {
  const search = useSearchParams();
  const router = useRouter();
  const view = (search.get('view') || 'week') as 'day'|'week'|'month';
  function setView(v: 'day'|'week'|'month') {
    const params = new URLSearchParams(search.toString());
    params.set('view', v);
    router.push(`/calendar?${params.toString()}`);
  }
  return (
    <div className="flex gap-2">
      {(['day','week','month'] as const).map(v => (
        <button key={v} onClick={()=>setView(v)} className={`px-3 py-2 rounded-lg border text-sm ${view===v?'bg-black text-white border-black':'bg-white border-gray-200 text-gray-700'}`}>
          {v[0].toUpperCase()+v.slice(1)}
        </button>
      ))}
    </div>
  );
}

function MonthGrid({ date }: { date: Date }) {
  const start = dayjs(date).startOf('month').startOf('week');
  const days = Array.from({length: 42}).map((_,i)=> start.add(i,'day'));
  return (
    <div className="grid" style={{gridTemplateColumns:'repeat(7, minmax(140px, 1fr))', gap:'8px' }}>
      {days.map((d,i)=>{
        const inMonth = d.month()===dayjs(date).month();
        return (
          <div key={i} className={`rounded-xl border p-2 ${inMonth?'bg-white':'bg-gray-50'}`}>
            <div className="text-xs text-gray-500 mb-1">{d.format('ddd')}</div>
            <div className="text-sm font-medium">{d.format('D')}</div>
            <div className="mt-2 text-xs text-gray-500">• events here</div>
          </div>
        );
      })}
    </div>
  );
}

export default function CalendarPage(){
  const today = dayjs();
  const search = useSearchParams();
  const view = (search.get('view') || 'week') as 'day'|'week'|'month';

  return (
    <main className="space-y-6">
      <section className="card">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Calendar</h2>
          <ViewSwitch />
        </div>
      </section>

      {view==='week' && (
        <section className="card">
          <RollingWeek date={today.toDate()} events={[]} bills={[]} />
        </section>
      )}

      {view==='day' && (
        <section className="card">
          <div className="text-sm text-gray-600 mb-2">{today.format('dddd, MMM D')}</div>
          <div className="rounded-xl border p-4 bg-white">Day view stub (list events for today)</div>
        </section>
      )}

      {view==='month' && (
        <section className="card">
          <MonthGrid date={today.toDate()} />
        </section>
      )}
    </main>
  );
}
