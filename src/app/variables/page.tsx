'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Button, SearchInput, Skeleton } from '@/components/ui';
import { DeleteModal } from '@/components/documents/delete-modal';
import { VariableRow, VariableFormModal } from '@/components/variables';
import { NavTabs } from '@/components/layout/nav-tabs';
import { useVariables } from '@/hooks/use-variables';
import { useDocuments } from '@/hooks/use-documents';
import { Variable } from '@/lib/types';
import { FileX } from 'lucide-react';

function VariableListSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-[#E8E8E8] divide-y divide-[#E8E8E8]">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3">
          <div className="flex-1">
            <Skeleton className="h-4 w-32 mb-1" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-6 w-20 rounded-md" />
          <Skeleton className="h-4 w-4 rounded" />
        </div>
      ))}
    </div>
  );
}

function EmptyVariables({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div className="bg-white rounded-lg border border-[#E8E8E8] p-12 text-center">
      <div className="w-12 h-12 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-4">
        <FileX className="w-6 h-6 text-[#6B6B6B]" strokeWidth={1.5} />
      </div>
      <h3 className="text-sm font-medium text-[#0F0F0F] mb-1">Aucune variable</h3>
      <p className="text-sm text-[#6B6B6B] mb-4">
        Créez votre première variable pour commencer l&apos;extraction de données.
      </p>
      <Button onClick={onCreateClick} size="sm">
        <Plus className="w-4 h-4" strokeWidth={1.5} />
        Nouvelle variable
      </Button>
    </div>
  );
}

function EmptySearch({ query }: { query: string }) {
  return (
    <div className="bg-white rounded-lg border border-[#E8E8E8] p-12 text-center">
      <div className="w-12 h-12 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-4">
        <Search className="w-6 h-6 text-[#6B6B6B]" strokeWidth={1.5} />
      </div>
      <h3 className="text-sm font-medium text-[#0F0F0F] mb-1">Aucun résultat</h3>
      <p className="text-sm text-[#6B6B6B]">
        Aucune variable ne correspond à &quot;{query}&quot;
      </p>
    </div>
  );
}

function VariablesContent() {
  const searchParams = useSearchParams();
  const documentFilter = searchParams.get('document');

  const { variables, loading: variablesLoading, addVariable, editVariable, removeVariable } = useVariables();
  const { documents, loading: documentsLoading } = useDocuments();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showSkeleton, setShowSkeleton] = useState(true);

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [editingVariable, setEditingVariable] = useState<Variable | null>(null);
  const [deletingVariable, setDeletingVariable] = useState<Variable | null>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Ensure skeleton shows for at least 400ms
  useEffect(() => {
    const loading = variablesLoading || documentsLoading;
    if (!loading) {
      const timer = setTimeout(() => {
        setShowSkeleton(false);
      }, 400);
      return () => clearTimeout(timer);
    }
    setShowSkeleton(true);
  }, [variablesLoading, documentsLoading]);

  const filteredVariables = useMemo(() => {
    return variables.filter((v) => {
      const matchesSearch = v.name.toLowerCase().includes(debouncedQuery.toLowerCase());
      const matchesDocument = !documentFilter || v.documentIds.includes(documentFilter);
      return matchesSearch && matchesDocument;
    });
  }, [variables, debouncedQuery, documentFilter]);

  const handleCreateVariable = async (data: Omit<Variable, 'id'>) => {
    await addVariable(data);
    toast.success('Variable créée avec succès');
  };

  const handleEditVariable = async (data: Omit<Variable, 'id'>) => {
    if (!editingVariable) return;
    await editVariable(editingVariable.id, data);
    toast.success('Variable modifiée avec succès');
  };

  const handleDeleteVariable = async () => {
    if (!deletingVariable) return;
    await removeVariable(deletingVariable.id);
    toast.success('Variable supprimée');
  };

  const isLoading = variablesLoading || documentsLoading || showSkeleton;

  const filterDocument = documentFilter ? documents.find(d => d.id === documentFilter) : null;

  return (
    <>
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-[#0F0F0F]">Variables</h1>
          <Button onClick={() => setIsNewModalOpen(true)} size="sm">
            <Plus className="w-4 h-4" strokeWidth={1.5} />
            Nouvelle
          </Button>
        </div>

        {/* Navigation */}
        <div className="mb-6">
          <NavTabs />
        </div>

        {/* Search */}
        <div className="mb-4">
          <SearchInput
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4" strokeWidth={1.5} />}
          />
        </div>

        {/* Document filter indicator */}
        {filterDocument && (
          <div className="mb-4 flex items-center gap-2 text-sm text-[#6B6B6B]">
            <span>Filtré par document :</span>
            <span className="font-medium text-[#0F0F0F]">{filterDocument.name}</span>
            <a
              href="/variables"
              className="text-[#1D6D1D] hover:underline ml-2"
            >
              Voir toutes
            </a>
          </div>
        )}

        {/* Variable list */}
        {isLoading ? (
          <VariableListSkeleton />
        ) : variables.length === 0 ? (
          <EmptyVariables onCreateClick={() => setIsNewModalOpen(true)} />
        ) : filteredVariables.length === 0 ? (
          <EmptySearch query={debouncedQuery} />
        ) : (
          <div className="bg-white rounded-lg border border-[#E8E8E8] divide-y divide-[#E8E8E8]">
            {filteredVariables.map((variable) => (
              <VariableRow
                key={variable.id}
                variable={variable}
                documents={documents}
                onEdit={(v) => setEditingVariable(v)}
                onDelete={(v) => setDeletingVariable(v)}
              />
            ))}
          </div>
        )}
      </div>

      {/* New variable modal */}
      <VariableFormModal
        isOpen={isNewModalOpen}
        documents={documents}
        onClose={() => setIsNewModalOpen(false)}
        onSubmit={handleCreateVariable}
      />

      {/* Edit variable modal */}
      <VariableFormModal
        isOpen={!!editingVariable}
        variable={editingVariable}
        documents={documents}
        onClose={() => setEditingVariable(null)}
        onSubmit={handleEditVariable}
      />

      {/* Delete confirmation modal */}
      <DeleteModal
        isOpen={!!deletingVariable}
        onClose={() => setDeletingVariable(null)}
        onConfirm={handleDeleteVariable}
        title="Supprimer la variable"
        message={`Êtes-vous sûr de vouloir supprimer la variable "${deletingVariable?.name}" ? Cette action est irréversible.`}
      />
    </>
  );
}

export default function VariablesPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Suspense fallback={
        <div className="max-w-3xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-9 w-24 rounded-lg" />
          </div>
          <div className="mb-6">
            <Skeleton className="h-10 w-52 rounded-lg" />
          </div>
          <div className="mb-4">
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          <VariableListSkeleton />
        </div>
      }>
        <VariablesContent />
      </Suspense>
    </div>
  );
}
