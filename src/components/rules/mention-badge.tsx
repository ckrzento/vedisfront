'use client';

import { MentionType } from '@/lib/rules-parser';

interface MentionBadgeProps {
  type: MentionType;
  name: string;
  onDelete?: () => void;
}

export function MentionBadge({ type, name }: MentionBadgeProps) {
  const isDocument = type === 'doc';

  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-sm font-medium mx-0.5 ${
        isDocument
          ? 'bg-[#E8F5E8] text-[#1D6D1D]'
          : 'bg-[#E8F0FE] text-[#1a56db]'
      }`}
      contentEditable={false}
      data-mention-type={type}
    >
      {name}
    </span>
  );
}
