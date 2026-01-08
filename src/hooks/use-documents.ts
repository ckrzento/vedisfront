'use client';

import { useState, useEffect, useCallback } from 'react';
import { DocumentType, Field } from '@/lib/types';
import {
  getDocuments,
  getDocument,
  createDocument,
  deleteDocument,
  getFieldsByDocument,
  createField,
  updateField,
  deleteField,
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

export function useFields(documentTypeId: string) {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFields = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getFieldsByDocument(documentTypeId);
      setFields(data);
    } finally {
      setLoading(false);
    }
  }, [documentTypeId]);

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  const addField = useCallback(async (data: { name: string; description: string; required: boolean }) => {
    const newField = await createField({
      ...data,
      documentTypeId,
      isSystem: false,
    });
    setFields((prev) => [...prev, newField]);
    return newField;
  }, [documentTypeId]);

  const editField = useCallback(async (id: string, data: { name: string; description: string; required: boolean }) => {
    const updated = await updateField(id, data);
    if (updated) {
      setFields((prev) => prev.map((f) => (f.id === id ? updated : f)));
    }
    return updated;
  }, []);

  const removeField = useCallback(async (id: string) => {
    await deleteField(id);
    setFields((prev) => prev.filter((f) => f.id !== id));
  }, []);

  return {
    fields,
    loading,
    addField,
    editField,
    removeField,
    refetch: fetchFields,
  };
}
