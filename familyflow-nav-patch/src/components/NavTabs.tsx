'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

function Tab({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname.startsWith(href);
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-lg border text-sm ${active ? 'bg-black text-white border-black' : 'bg-white border-gray-200 text-gray-700'}`}
    >
      {label}
    </Link>
  );
}

export default function NavTabs() {
  return (
    <nav className="flex gap-2">
      <Tab href="/dashboard" label="Dashboard" />
      <Tab href="/calendar" label="Calendar" />
    </nav>
  );
}
