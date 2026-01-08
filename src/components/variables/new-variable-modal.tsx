'use client';

import { useState, useEffect, useRef } from 'react';
import { Modal, ModalContent, ModalFooter, Button, Input, Textarea } from '@/components/ui';
import { variableNameExists } from '@/lib/data';

interface NewVariableModalProps {
  isOpen: boolean;
  documentName?: string;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string }) => Promise<void>;
}

export function NewVariableModal({ isOpen, documentName, onClose, onSubmit }: NewVariableModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string }>({});
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setDescription('');
      setErrors({});
      setTimeout(() => nameInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { name?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Ce champ est requis';
    } else if (variableNameExists(name.trim())) {
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
        description: description.trim(),
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <ModalContent>
          <h2 className="text-lg font-semibold text-[#0F0F0F] mb-1">
            Nouvelle variable
          </h2>
          {documentName && (
            <p className="text-sm text-[#6B6B6B] mb-4">
              Sera associée à {documentName}
            </p>
          )}
          <div className="space-y-4">
            <Input
              ref={nameInputRef}
              label="Nom"
              placeholder="Ex: Lieu de naissance, Nationalité..."
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
          </div>
        </ModalContent>
        <ModalFooter>
          <Button type="button" variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" loading={loading}>
            Créer
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
