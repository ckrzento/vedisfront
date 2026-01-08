'use client';

import { FileX, ListX } from 'lucide-react';
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

interface EmptyFieldsProps {
  onAddClick: () => void;
}

export function EmptyFields({ onAddClick }: EmptyFieldsProps) {
  return (
    <div className="bg-white rounded-lg border border-dashed border-[#D4D4D4] p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#F5F5F5] rounded-lg flex items-center justify-center">
            <ListX className="w-5 h-5 text-[#9CA3AF]" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-sm font-medium text-[#0F0F0F]">Aucun champ configuré</p>
            <p className="text-xs text-[#6B6B6B]">
              Définissez les données à extraire de ce document.
            </p>
          </div>
        </div>
        <Button size="sm" onClick={onAddClick}>
          Ajouter un champ
        </Button>
      </div>
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
