'use client';

import { useState } from 'react';
import { Modal, ModalContent, ModalFooter, Button } from '@/components/ui';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  message: string;
}

export function DeleteModal({ isOpen, onClose, onConfirm, title, message }: DeleteModalProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <h2 className="text-lg font-semibold text-[#0F0F0F] mb-2">
          {title}
        </h2>
        <p className="text-sm text-[#6B6B6B]">
          {message}
        </p>
      </ModalContent>
      <ModalFooter>
        <Button type="button" variant="ghost" onClick={onClose}>
          Annuler
        </Button>
        <Button variant="danger" onClick={handleConfirm} loading={loading}>
          Supprimer
        </Button>
      </ModalFooter>
    </Modal>
  );
}
