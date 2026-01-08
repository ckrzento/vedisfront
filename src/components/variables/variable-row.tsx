'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Pencil, Trash2, Sparkles } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Variable, DocumentType } from '@/lib/types';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#0F0F0F] text-white text-xs rounded whitespace-nowrap z-50 pointer-events-none">
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0F0F0F]" />
        </div>
      )}
    </div>
  );
}

interface VariableRowProps {
  variable: Variable;
  documents: DocumentType[];
  onEdit?: (variable: Variable) => void;
  onDelete?: (variable: Variable) => void;
}

export function VariableRow({ variable, documents, onEdit, onDelete }: VariableRowProps) {
  const getDocumentIcon = (doc: DocumentType) => {
    const iconName = doc.icon
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('') as keyof typeof LucideIcons;
    return (LucideIcons[iconName] as LucideIcons.LucideIcon) || LucideIcons.FileText;
  };

  const associatedDocs = documents.filter(d => variable.documentIds.includes(d.id));
  const isAutoSearch = associatedDocs.length === 0;

  return (
    <Link
      href={`/variables/${variable.id}`}
      className="group flex items-center gap-3 px-4 py-3 hover:bg-[#FAFAFA] transition-colors duration-100"
    >
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-[#0F0F0F]">
          {variable.name}
        </span>
        {variable.description && (
          <p className="text-xs text-[#6B6B6B] mt-0.5 truncate">
            {variable.description}
          </p>
        )}
      </div>

      {/* Document icons */}
      <div className="flex items-center gap-1">
        {isAutoSearch ? (
          <Tooltip content="Recherche automatique dans tous les documents">
            <div className="flex items-center justify-center w-7 h-7 bg-amber-50 border border-amber-200 rounded-md">
              <Sparkles className="w-4 h-4 text-amber-600" strokeWidth={1.5} />
            </div>
          </Tooltip>
        ) : (
          <>
            {associatedDocs.slice(0, 4).map((doc) => {
              const IconComponent = getDocumentIcon(doc);
              return (
                <Tooltip key={doc.id} content={doc.name}>
                  <div className="flex items-center justify-center w-7 h-7 bg-[#EBEBEB] border border-[#DCDCDC] rounded-md hover:bg-[#E0E0E0] transition-colors">
                    <IconComponent className="w-4 h-4 text-[#444444]" strokeWidth={1.5} />
                  </div>
                </Tooltip>
              );
            })}
            {associatedDocs.length > 4 && (
              <Tooltip content={associatedDocs.slice(4).map(d => d.name).join(', ')}>
                <div className="flex items-center justify-center w-7 h-7 bg-[#EBEBEB] border border-[#DCDCDC] rounded-md text-xs font-medium text-[#444444]">
                  +{associatedDocs.length - 4}
                </div>
              </Tooltip>
            )}
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-100">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onEdit) onEdit(variable);
          }}
          className="p-1.5 rounded text-[#6B6B6B] hover:text-[#0F0F0F] hover:bg-[#E8E8E8] transition-colors duration-100"
          title="Modifier"
        >
          <Pencil className="w-3.5 h-3.5" strokeWidth={1.5} />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onDelete) onDelete(variable);
          }}
          className="p-1.5 rounded text-[#6B6B6B] hover:text-[#E53935] hover:bg-red-50 transition-colors duration-100"
          title="Supprimer"
        >
          <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
        </button>
      </div>

      <ChevronRight
        className="w-4 h-4 text-[#6B6B6B] opacity-0 group-hover:opacity-100 transition-opacity duration-100"
        strokeWidth={1.5}
      />
    </Link>
  );
}
