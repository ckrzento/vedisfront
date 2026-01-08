'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/variables', label: 'Variables' },
  { href: '/documents', label: 'Documents' },
  { href: '/regles', label: 'Règles' },
];

export function NavTabs() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="flex gap-1 p-1 bg-white border border-[#E8E8E8] rounded-lg w-fit">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`
            px-4 py-1.5 text-sm font-medium rounded-md
            transition-all duration-150
            ${isActive(tab.href)
              ? 'bg-[#0F0F0F] text-white'
              : 'text-[#6B6B6B] hover:text-[#0F0F0F] hover:bg-[#FAFAFA]'
            }
          `}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
