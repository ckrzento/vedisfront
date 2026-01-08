'use client';

import { Check, Loader2 } from 'lucide-react';

export type SaveStatus = 'saved' | 'saving' | 'unsaved';

interface SaveIndicatorProps {
  status: SaveStatus;
}

export function SaveIndicator({ status }: SaveIndicatorProps) {
  if (status === 'saving') {
    return (
      <div className="flex items-center gap-1.5 text-sm text-[#6B6B6B]">
        <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={2} />
        <span>Enregistrement...</span>
      </div>
    );
  }

  if (status === 'unsaved') {
    return (
      <div className="flex items-center gap-1.5 text-sm text-amber-600">
        <span>Modifications non enregistrées</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-sm text-[#9CA3AF]">
      <Check className="w-3.5 h-3.5" strokeWidth={2} />
      <span>Enregistré</span>
    </div>
  );
}
