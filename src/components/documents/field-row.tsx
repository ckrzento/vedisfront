'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { Field } from '@/lib/types';
import { Badge } from '@/components/ui';

interface FieldRowProps {
  field: Field;
  onEdit?: (field: Field) => void;
  onDelete?: (field: Field) => void;
}

export function FieldRow({ field, onEdit, onDelete }: FieldRowProps) {
  const handleClick = () => {
    if (onEdit) {
      onEdit(field);
    }
  };

  return (
    <div
      className="group flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#FAFAFA] transition-colors duration-100"
      onClick={handleClick}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#0F0F0F]">
            {field.name}
          </span>
          {field.required && (
            <Badge variant="required">Requis</Badge>
          )}
        </div>
        {field.description && (
          <p className="text-xs text-[#6B6B6B] mt-0.5 truncate">
            {field.description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-100">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onEdit) onEdit(field);
          }}
          className="p-1 rounded text-[#6B6B6B] hover:text-[#0F0F0F] hover:bg-[#E8E8E8] transition-colors duration-100"
          title="Modifier"
        >
          <Pencil className="w-3 h-3" strokeWidth={1.5} />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onDelete) onDelete(field);
          }}
          className="p-1 rounded text-[#6B6B6B] hover:text-[#E53935] hover:bg-red-50 transition-colors duration-100"
          title="Supprimer"
        >
          <Trash2 className="w-3 h-3" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
