'use client';

import { useState, useEffect, useRef } from 'react';
import { Modal, ModalContent, ModalFooter, Button, Input, Textarea, Toggle } from '@/components/ui';
import { Field } from '@/lib/types';

interface EditFieldModalProps {
  isOpen: boolean;
  field: Field | null;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string; required: boolean }) => Promise<void>;
  onDeleteRequest: () => void;
}

export function EditFieldModal({ isOpen, field, onClose, onSubmit, onDeleteRequest }: EditFieldModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [required, setRequired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string }>({});
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && field) {
      setName(field.name);
      setDescription(field.description || '');
      setRequired(field.required);
      setErrors({});
      setTimeout(() => nameInputRef.current?.focus(), 100);
    }
  }, [isOpen, field]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { name?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Ce champ est requis';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      nameInputRef.current?.focus();
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ name: name.trim(), description: description.trim(), required });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <ModalContent>
          <h2 className="text-lg font-semibold text-[#0F0F0F] mb-4">
            Modifier le champ
          </h2>
          <div className="space-y-4">
            <Input
              ref={nameInputRef}
              label="Nom du champ"
              placeholder="Ex: Numéro de facture"
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
            <Toggle
              label="Obligatoire"
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
            />
          </div>
        </ModalContent>
        <ModalFooter className="justify-between">
          <Button
            type="button"
            variant="danger-outline"
            onClick={onDeleteRequest}
          >
            Supprimer
          </Button>
          <div className="flex gap-3">
            <Button type="button" variant="ghost" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" loading={loading}>
              Enregistrer
            </Button>
          </div>
        </ModalFooter>
      </form>
    </Modal>
  );
}
