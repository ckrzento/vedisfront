'use client';

import { useState, useEffect, useCallback } from 'react';
import { Variable } from '@/lib/types';
import {
  getVariables,
  getVariable,
  getVariablesByDocument,
  createVariable,
  updateVariable,
  deleteVariable,
} from '@/lib/data';

export function useVariables() {
  const [variables, setVariables] = useState<Variable[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVariables = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getVariables();
      setVariables(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVariables();
  }, [fetchVariables]);

  const addVariable = useCallback(async (data: Omit<Variable, 'id'>) => {
    const newVar = await createVariable(data);
    setVariables((prev) => [...prev, newVar]);
    return newVar;
  }, []);

  const editVariable = useCallback(async (id: string, data: Partial<Omit<Variable, 'id'>>) => {
    const updated = await updateVariable(id, data);
    if (updated) {
      setVariables((prev) => prev.map((v) => (v.id === id ? updated : v)));
    }
    return updated;
  }, []);

  const removeVariable = useCallback(async (id: string) => {
    await deleteVariable(id);
    setVariables((prev) => prev.filter((v) => v.id !== id));
  }, []);

  return {
    variables,
    loading,
    addVariable,
    editVariable,
    removeVariable,
    refetch: fetchVariables,
  };
}

export function useVariable(id: string) {
  const [variable, setVariable] = useState<Variable | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchVariable = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getVariable(id);
      setVariable(data || null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchVariable();
  }, [fetchVariable]);

  const editVariable = useCallback(async (data: Partial<Omit<Variable, 'id'>>) => {
    const updated = await updateVariable(id, data);
    if (updated) {
      setVariable(updated);
    }
    return updated;
  }, [id]);

  return { variable, loading, editVariable, refetch: fetchVariable };
}

export function useVariablesByDocument(documentId: string) {
  const [variables, setVariables] = useState<Variable[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVariables = async () => {
      setLoading(true);
      try {
        const data = await getVariablesByDocument(documentId);
        setVariables(data);
      } finally {
        setLoading(false);
      }
    };

    fetchVariables();
  }, [documentId]);

  return { variables, loading };
}
