'use client';

import { useState, useEffect, useCallback } from 'react';
import { NavTabs } from '@/components/layout/nav-tabs';
import { RulesEditor } from '@/components/rules/rules-editor';
import { getDocuments, getVariables, getRulesConfig, saveRulesConfig } from '@/lib/data';
import { DocumentType, Variable } from '@/lib/types';

export default function ReglesPage() {
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [variables, setVariables] = useState<Variable[]>([]);
  const [initialContent, setInitialContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [docs, vars, rules] = await Promise.all([
          getDocuments(),
          getVariables(),
          getRulesConfig(),
        ]);
        setDocuments(docs);
        setVariables(vars);
        setInitialContent(rules.content);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = useCallback(async (content: string) => {
    await saveRulesConfig(content);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold text-[#0F0F0F]">Règles</h1>
          </div>

          {/* Navigation */}
          <div className="mb-6">
            <NavTabs />
          </div>

          {/* Loading skeleton */}
          <div className="bg-white rounded-lg border border-[#E8E8E8] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#E8E8E8]">
              <div className="w-24 h-5 skeleton rounded" />
              <div className="w-16 h-8 skeleton rounded" />
            </div>
            <div className="p-6">
              <div className="min-h-[500px] p-4 border border-[#E8E8E8] rounded-lg">
                <div className="space-y-3">
                  <div className="w-48 h-6 skeleton rounded" />
                  <div className="w-full h-4 skeleton rounded" />
                  <div className="w-3/4 h-4 skeleton rounded" />
                  <div className="w-5/6 h-4 skeleton rounded" />
                  <div className="w-32 h-6 skeleton rounded mt-6" />
                  <div className="w-full h-4 skeleton rounded" />
                  <div className="w-2/3 h-4 skeleton rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-[#0F0F0F]">Règles</h1>
        </div>

        {/* Navigation */}
        <div className="mb-6">
          <NavTabs />
        </div>

        {/* Editor */}
        <div className="bg-white rounded-lg border border-[#E8E8E8] overflow-hidden">
          <RulesEditor
            initialContent={initialContent}
            documents={documents}
            variables={variables}
            onSave={handleSave}
          />
        </div>
      </div>
    </div>
  );
}
