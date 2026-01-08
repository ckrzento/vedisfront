'use client';

import Link from 'next/link';
import * as LucideIcons from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { DocumentType } from '@/lib/types';
import { ExternalBadge } from '@/components/ui';

interface DocumentRowProps {
  document: DocumentType;
}

export function DocumentRow({ document }: DocumentRowProps) {
  const iconName = document.icon
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('') as keyof typeof LucideIcons;

  const IconComponent = (LucideIcons[iconName] as LucideIcons.LucideIcon) || LucideIcons.FileText;

  return (
    <Link
      href={`/documents/${document.id}`}
      className="flex items-center gap-4 px-4 py-3 hover:bg-[#FAFAFA] transition-colors duration-100 group"
    >
      <IconComponent
        className="w-5 h-5 text-[#6B6B6B] flex-shrink-0"
        strokeWidth={1.5}
      />
      <span className="text-sm font-medium text-[#0F0F0F] flex-1 truncate">
        {document.name}
      </span>
      {document.isExternal && <ExternalBadge />}
      <ChevronRight
        className="w-4 h-4 text-[#6B6B6B] opacity-0 group-hover:opacity-100 transition-opacity duration-100"
        strokeWidth={1.5}
      />
    </Link>
  );
}
