'use client';

import { X, FileText, Variable, Hash, AtSign } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface HelpDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpDrawer({ isOpen, onClose }: HelpDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-40" />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed right-0 top-0 h-full w-[360px] bg-white shadow-xl z-50 overflow-y-auto animate-slide-in-right"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#E8E8E8] px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#0F0F0F]">Aide - Éditeur de règles</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-[#F5F5F5] transition-colors"
          >
            <X className="w-5 h-5 text-[#6B6B6B]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Introduction */}
          <section>
            <p className="text-sm text-[#6B6B6B] leading-relaxed">
              L'éditeur de règles vous permet de définir des instructions de validation
              pour l'extraction de données. Vous pouvez référencer des documents et des
              variables pour créer des règles dynamiques.
            </p>
          </section>

          {/* Mentions */}
          <section>
            <h3 className="text-sm font-semibold text-[#0F0F0F] mb-3 flex items-center gap-2">
              <AtSign className="w-4 h-4" />
              Mentions
            </h3>
            <p className="text-sm text-[#6B6B6B] mb-3">
              Tapez <code className="px-1.5 py-0.5 bg-[#F5F5F5] rounded text-[#0F0F0F] font-mono">@</code> pour
              insérer une mention vers un document ou une variable.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 bg-[#FAFAFA] rounded-md">
                <div className="w-6 h-6 rounded bg-[#E8F5E8] flex items-center justify-center">
                  <FileText className="w-3.5 h-3.5 text-[#1D6D1D]" />
                </div>
                <div>
                  <div className="text-sm font-medium text-[#0F0F0F]">Document</div>
                  <div className="text-xs text-[#6B6B6B]">Référence un document source</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 bg-[#FAFAFA] rounded-md">
                <div className="w-6 h-6 rounded bg-[#E8F0FE] flex items-center justify-center">
                  <Variable className="w-3.5 h-3.5 text-[#1a56db]" />
                </div>
                <div>
                  <div className="text-sm font-medium text-[#0F0F0F]">Variable</div>
                  <div className="text-xs text-[#6B6B6B]">Référence une variable extraite</div>
                </div>
              </div>
            </div>
          </section>

          {/* Headers */}
          <section>
            <h3 className="text-sm font-semibold text-[#0F0F0F] mb-3 flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Titres
            </h3>
            <p className="text-sm text-[#6B6B6B] mb-3">
              Commencez une ligne par <code className="px-1.5 py-0.5 bg-[#F5F5F5] rounded text-[#0F0F0F] font-mono">#</code> suivi
              d'un espace pour créer un titre de section.
            </p>
            <div className="p-3 bg-[#FAFAFA] rounded-md">
              <div className="text-sm text-[#6B6B6B] font-mono mb-1"># Validation des dates</div>
              <div className="text-[18px] font-semibold text-[#0F0F0F]">Validation des dates</div>
            </div>
          </section>

          {/* Keyboard shortcuts */}
          <section>
            <h3 className="text-sm font-semibold text-[#0F0F0F] mb-3">Raccourcis clavier</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-[#FAFAFA] rounded-md">
                <span className="text-sm text-[#6B6B6B]">Insérer une mention</span>
                <kbd className="px-2 py-1 bg-white border border-[#E8E8E8] rounded text-xs font-mono">@</kbd>
              </div>
              <div className="flex items-center justify-between p-2 bg-[#FAFAFA] rounded-md">
                <span className="text-sm text-[#6B6B6B]">Naviguer dans le menu</span>
                <div className="flex gap-1">
                  <kbd className="px-2 py-1 bg-white border border-[#E8E8E8] rounded text-xs font-mono">↑</kbd>
                  <kbd className="px-2 py-1 bg-white border border-[#E8E8E8] rounded text-xs font-mono">↓</kbd>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 bg-[#FAFAFA] rounded-md">
                <span className="text-sm text-[#6B6B6B]">Sélectionner</span>
                <kbd className="px-2 py-1 bg-white border border-[#E8E8E8] rounded text-xs font-mono">Entrée</kbd>
              </div>
              <div className="flex items-center justify-between p-2 bg-[#FAFAFA] rounded-md">
                <span className="text-sm text-[#6B6B6B]">Fermer / Retour</span>
                <kbd className="px-2 py-1 bg-white border border-[#E8E8E8] rounded text-xs font-mono">Échap</kbd>
              </div>
            </div>
          </section>

          {/* Example */}
          <section>
            <h3 className="text-sm font-semibold text-[#0F0F0F] mb-3">Exemple de règle</h3>
            <div className="p-3 bg-[#FAFAFA] rounded-md text-sm text-[#6B6B6B] leading-relaxed">
              <p className="mb-2">
                <span className="text-[18px] font-semibold text-[#0F0F0F]"># Validation du capital</span>
              </p>
              <p>
                Vérifier que le{' '}
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-[#E8F0FE] text-[#1a56db]">
                  Capital social
                </span>{' '}
                extrait de{' '}
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-[#E8F5E8] text-[#1D6D1D]">
                  Pappers
                </span>{' '}
                correspond à celui des{' '}
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-[#E8F5E8] text-[#1D6D1D]">
                  Statuts
                </span>
                .
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
