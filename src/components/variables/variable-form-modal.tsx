'use client';

import { useState, useEffect, useRef } from 'react';
import { Sparkles, Check } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Modal, ModalContent, ModalFooter, Button, Input, Textarea } from '@/components/ui';
import { Variable, DocumentType } from '@/lib/types';
import { variableNameExists } from '@/lib/data';

interface VariableFormModalProps {
  isOpen: boolean;
  variable?: Variable | null;
  documents: DocumentType[];
  onClose: () => void;
  onSubmit: (data: Omit<Variable, 'id'>) => Promise<void>;
}

export function VariableFormModal({ isOpen, variable, documents, onClose, onSubmit }: VariableFormModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isEditing = !!variable;

  useEffect(() => {
    if (isOpen) {
      if (variable) {
        setName(variable.name);
        setDescription(variable.description || '');
        setSelectedDocumentIds(variable.documentIds);
      } else {
        setName('');
        setDescription('');
        setSelectedDocumentIds([]);
      }
      setErrors({});
      setIsDropdownOpen(false);
      setTimeout(() => nameInputRef.current?.focus(), 100);
    }
  }, [isOpen, variable]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { name?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Ce champ est requis';
    } else if (variableNameExists(name.trim(), variable?.id)) {
      newErrors.name = 'Cette variable existe déjà';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      nameInputRef.current?.focus();
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || undefined,
        documentIds: selectedDocumentIds,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const getDocumentIcon = (doc: DocumentType) => {
    const iconName = doc.icon
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('') as keyof typeof LucideIcons;
    return (LucideIcons[iconName] as LucideIcons.LucideIcon) || LucideIcons.FileText;
  };

  const toggleDocument = (docId: string) => {
    setSelectedDocumentIds(prev =>
      prev.includes(docId)
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const selectedDocs = documents.filter(d => selectedDocumentIds.includes(d.id));

  const getButtonLabel = () => {
    if (selectedDocumentIds.length === 0) {
      return 'Recherche automatique';
    }
    if (selectedDocumentIds.length === 1) {
      return selectedDocs[0]?.name || '';
    }
    return `${selectedDocumentIds.length} documents`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <ModalContent>
          <h2 className="text-lg font-semibold text-[#0F0F0F] mb-4">
            {isEditing ? 'Modifier la variable' : 'Nouvelle variable'}
          </h2>
          <div className="space-y-4">
            <Input
              ref={nameInputRef}
              label="Nom"
              placeholder="Ex: SIREN, Raison sociale..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
            />
            <Textarea
              label="Description"
              placeholder="Description optionnelle..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {/* Document selector (multi-select) */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#0F0F0F]">Documents cibles</label>
              <p className="text-xs text-[#6B6B6B] mb-2">
                Sélectionnez les documents où chercher cette variable. Laissez vide pour recherche automatique.
              </p>
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm bg-white border border-[#E8E8E8] rounded-lg hover:border-[#CCCCCC] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {selectedDocumentIds.length === 0 ? (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-500" strokeWidth={1.5} />
                        <span className="text-amber-700">{getButtonLabel()}</span>
                      </>
                    ) : selectedDocumentIds.length === 1 ? (
                      <>
                        {(() => {
                          const SelectedIcon = getDocumentIcon(selectedDocs[0]);
                          return <SelectedIcon className="w-4 h-4 text-[#6B6B6B]" strokeWidth={1.5} />;
                        })()}
                        <span>{getButtonLabel()}</span>
                      </>
                    ) : (
                      <>
                        <div className="flex -space-x-1">
                          {selectedDocs.slice(0, 3).map((doc) => {
                            const DocIcon = getDocumentIcon(doc);
                            return (
                              <div key={doc.id} className="w-5 h-5 bg-[#F5F5F5] rounded flex items-center justify-center border border-white">
                                <DocIcon className="w-3 h-3 text-[#6B6B6B]" strokeWidth={1.5} />
                              </div>
                            );
                          })}
                        </div>
                        <span>{getButtonLabel()}</span>
                      </>
                    )}
                  </div>
                  <svg className="w-4 h-4 text-[#6B6B6B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-[#E8E8E8] rounded-lg shadow-lg max-h-60 overflow-auto">
                    <button
                      type="button"
                      onClick={() => setSelectedDocumentIds([])}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-amber-50/50 ${
                        selectedDocumentIds.length === 0 ? 'bg-amber-50' : ''
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-amber-500" strokeWidth={1.5} />
                      <span className="text-amber-700">Recherche automatique</span>
                      {selectedDocumentIds.length === 0 && (
                        <Check className="w-4 h-4 ml-auto text-amber-600" strokeWidth={2} />
                      )}
                    </button>
                    <div className="border-t border-[#E8E8E8]" />
                    {documents.map((doc) => {
                      const DocIcon = getDocumentIcon(doc);
                      const isSelected = selectedDocumentIds.includes(doc.id);
                      return (
                        <button
                          key={doc.id}
                          type="button"
                          onClick={() => toggleDocument(doc.id)}
                          className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-[#FAFAFA] ${
                            isSelected ? 'bg-[#F5F5F5]' : ''
                          }`}
                        >
                          <DocIcon className="w-4 h-4 text-[#6B6B6B]" strokeWidth={1.5} />
                          <span className="flex-1">{doc.name}</span>
                          {isSelected && (
                            <Check className="w-4 h-4 text-[#1D6D1D]" strokeWidth={2} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Selected documents pills */}
              {selectedDocumentIds.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selectedDocs.map((doc) => {
                    const DocIcon = getDocumentIcon(doc);
                    return (
                      <div
                        key={doc.id}
                        className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#F5F5F5] rounded-md text-xs"
                      >
                        <DocIcon className="w-3 h-3 text-[#6B6B6B]" strokeWidth={1.5} />
                        <span className="text-[#0F0F0F]">{doc.name}</span>
                        <button
                          type="button"
                          onClick={() => toggleDocument(doc.id)}
                          className="ml-0.5 text-[#6B6B6B] hover:text-[#0F0F0F]"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </ModalContent>
        <ModalFooter>
          <Button type="button" variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" loading={loading}>
            {isEditing ? 'Enregistrer' : 'Créer'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
