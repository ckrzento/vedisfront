'use client';

import { FileX } from 'lucide-react';
import { Button } from '@/components/ui';

interface EmptyDocumentsProps {
  onCreateClick: () => void;
}

export function EmptyDocuments({ onCreateClick }: EmptyDocumentsProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <FileX className="w-12 h-12 text-[#CCCCCC] mb-4" strokeWidth={1.5} />
      <p className="text-[#6B6B6B] mb-4">Aucun document</p>
      <Button onClick={onCreateClick}>
        Créer un document
      </Button>
    </div>
  );
}

interface EmptySearchProps {
  query: string;
}

export function EmptySearch({ query }: EmptySearchProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <p className="text-[#6B6B6B] text-sm">
        Aucun résultat pour &quot;{query}&quot;
      </p>
    </div>
  );
}
