'use client';

import { useState, useEffect, useCallback } from 'react';
import { DocumentType } from '@/lib/types';
import {
  getDocuments,
  getDocument,
  createDocument,
  deleteDocument,
} from '@/lib/data';

export function useDocuments() {
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDocuments();
      setDocuments(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const addDocument = useCallback(async (data: { name: string; description: string }) => {
    const newDoc = await createDocument({
      ...data,
      icon: 'file-text',
    });
    setDocuments((prev) => [...prev, newDoc]);
    return newDoc;
  }, []);

  const removeDocument = useCallback(async (id: string) => {
    await deleteDocument(id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  }, []);

  return {
    documents,
    loading,
    addDocument,
    removeDocument,
    refetch: fetchDocuments,
  };
}

export function useDocument(id: string) {
  const [document, setDocument] = useState<DocumentType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocument = async () => {
      setLoading(true);
      try {
        const data = await getDocument(id);
        setDocument(data || null);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  return { document, loading };
}
