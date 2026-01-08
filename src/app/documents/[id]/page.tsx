'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, ChevronRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Button, DocumentDetailSkeleton } from '@/components/ui';
import { DeleteModal } from '@/components/documents';
import { NewVariableModal } from '@/components/variables';
import { useDocument } from '@/hooks/use-documents';
import { useVariablesByDocument } from '@/hooks/use-variables';
import { deleteDocument } from '@/lib/data';

export default function DocumentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const documentId = params.id as string;

  const { document, loading: documentLoading } = useDocument(documentId);
  const { variables, loading: variablesLoading, addVariable } = useVariablesByDocument(documentId);

  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isNewVariableModalOpen, setIsNewVariableModalOpen] = useState(false);

  const loading = documentLoading || variablesLoading;

  // Ensure skeleton shows for at least 400ms
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setShowSkeleton(false);
      }, 400);
      return () => clearTimeout(timer);
    }
    setShowSkeleton(true);
  }, [loading]);

  const handleAddVariable = async (data: { name: string; description: string }) => {
    await addVariable(data);
    toast.success('Variable créée');
  };

  const handleDeleteDocument = async () => {
    await deleteDocument(documentId);
    toast.success('Document supprimé');
    router.push('/documents');
  };

  const isLoading = loading || showSkeleton;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-sm text-[#6B6B6B] hover:text-[#0F0F0F] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            Retour
          </button>
          <DocumentDetailSkeleton />
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-sm text-[#6B6B6B] hover:text-[#0F0F0F] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            Retour
          </button>
          <p className="text-[#6B6B6B]">Document introuvable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Back button */}
        <button
          onClick={() => router.push('/documents')}
          className="inline-flex items-center gap-1.5 text-sm text-[#6B6B6B] hover:text-[#0F0F0F] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          Retour
        </button>

        {/* Document header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[#0F0F0F] mb-2">
            {document.name}
          </h1>
          {document.description && (
            <p className="text-[#6B6B6B]">{document.description}</p>
          )}
        </div>

        {/* Variables section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-medium text-[#0F0F0F]">Variables</h2>
              <span className="text-sm text-[#6B6B6B]">({variables.length})</span>
            </div>
            <div className="flex items-center gap-3">
              {variables.length > 0 && (
                <Link
                  href="/variables"
                  className="inline-flex items-center gap-1 text-sm text-[#6B6B6B] hover:text-[#0F0F0F] transition-colors"
                >
                  Toutes les variables
                  <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
                </Link>
              )}
              <Button size="sm" onClick={() => setIsNewVariableModalOpen(true)}>
                <Plus className="w-4 h-4" strokeWidth={1.5} />
                Ajouter
              </Button>
            </div>
          </div>

          {variables.length === 0 ? (
            <div className="bg-white rounded-lg border border-dashed border-[#D4D4D4] p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#F5F5F5] rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-[#9CA3AF]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0F0F0F]">Aucune variable</p>
                    <p className="text-xs text-[#6B6B6B]">
                      Ajoutez les données à extraire de ce document.
                    </p>
                  </div>
                </div>
                <Button size="sm" onClick={() => setIsNewVariableModalOpen(true)}>
                  <Plus className="w-4 h-4" strokeWidth={1.5} />
                  Ajouter
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-[#E8E8E8] divide-y divide-[#E8E8E8]">
              {variables.map((variable) => (
                <Link
                  key={variable.id}
                  href={`/variables/${variable.id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#FAFAFA] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-[#0F0F0F]">
                      {variable.name}
                    </span>
                    {variable.description && (
                      <p className="text-xs text-[#6B6B6B] mt-0.5 truncate">
                        {variable.description}
                      </p>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#6B6B6B]" strokeWidth={1.5} />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Danger zone */}
        <div className="pt-8 border-t border-[#E8E8E8]">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#6B6B6B]">Supprimer ce document</span>
            <Button
              variant="danger-outline"
              size="sm"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Supprimer
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <NewVariableModal
        isOpen={isNewVariableModalOpen}
        documentName={document.name}
        onClose={() => setIsNewVariableModalOpen(false)}
        onSubmit={handleAddVariable}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteDocument}
        title="Supprimer ce document"
        message="Cette action est irréversible."
      />
    </div>
  );
}
