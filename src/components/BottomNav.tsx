'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav(){
  const path = usePathname();
  const Item = ({href,label}:{href:string;label:string}) => (
    <Link href={href} className={`flex-1 text-center py-3 ${path.startsWith(href)?'font-semibold':''}`}>{label}</Link>
  );
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-white md:hidden flex">
      <Item href="/dashboard" label="Dashboard" />
      <Item href="/calendar" label="Calendar" />
    </div>
  );
}
