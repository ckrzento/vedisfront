'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Pencil, Sparkles } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { toast } from 'sonner';
import { Button, Skeleton } from '@/components/ui';
import { DeleteModal } from '@/components/documents/delete-modal';
import { VariableFormModal } from '@/components/variables';
import { useVariable } from '@/hooks/use-variables';
import { useDocuments } from '@/hooks/use-documents';
import { deleteVariable } from '@/lib/data';
import { DocumentType } from '@/lib/types';

function VariableDetailSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="w-[200px] h-7" />
          <Skeleton className="w-[60px] h-5 rounded-full" />
        </div>
        <Skeleton className="w-[300px] h-4" />
      </div>

      <div className="bg-white rounded-lg border border-[#E8E8E8] p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="w-[100px] h-4" />
            <Skeleton className="w-[150px] h-6 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VariableDetailPage() {
  const router = useRouter();
  const params = useParams();
  const variableId = params.id as string;

  const { variable, loading: variableLoading, editVariable } = useVariable(variableId);
  const { documents, loading: documentsLoading } = useDocuments();

  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const loading = variableLoading || documentsLoading;

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

  const getDocumentIcon = (doc: DocumentType) => {
    const iconName = doc.icon
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('') as keyof typeof LucideIcons;
    return (LucideIcons[iconName] as LucideIcons.LucideIcon) || LucideIcons.FileText;
  };

  const associatedDocuments = variable
    ? documents.filter(d => variable.documentIds.includes(d.id))
    : [];

  const isAutoSearch = associatedDocuments.length === 0;

  const handleEditVariable = async (data: { name: string; description?: string; documentIds: string[] }) => {
    await editVariable(data);
    toast.success('Variable modifiée avec succès');
  };

  const handleDeleteVariable = async () => {
    await deleteVariable(variableId);
    toast.success('Variable supprimée');
    router.push('/variables');
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
          <VariableDetailSkeleton />
        </div>
      </div>
    );
  }

  if (!variable) {
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
          <p className="text-[#6B6B6B]">Variable introuvable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Back button */}
        <button
          onClick={() => router.push('/variables')}
          className="inline-flex items-center gap-1.5 text-sm text-[#6B6B6B] hover:text-[#0F0F0F] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          Retour
        </button>

        {/* Variable header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-semibold text-[#0F0F0F]">
              {variable.name}
            </h1>
            <Button size="sm" variant="ghost" onClick={() => setIsEditModalOpen(true)}>
              <Pencil className="w-4 h-4" strokeWidth={1.5} />
              Modifier
            </Button>
          </div>
          {variable.description && (
            <p className="text-[#6B6B6B]">{variable.description}</p>
          )}
        </div>

        {/* Info card - Documents cibles */}
        <div className="bg-white rounded-lg border border-[#E8E8E8] p-6 mb-8">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-sm text-[#6B6B6B]">Documents cibles</span>
                {!isAutoSearch && (
                  <p className="text-xs text-[#6B6B6B] mt-1">
                    La variable sera recherchée et cross-checkée dans ces documents
                  </p>
                )}
              </div>
            </div>

            {isAutoSearch ? (
              <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-md text-sm w-fit">
                <Sparkles className="w-4 h-4 text-amber-600" strokeWidth={1.5} />
                <span className="text-amber-700 font-medium">Recherche automatique dans tous les documents</span>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {associatedDocuments.map((doc) => {
                  const IconComponent = getDocumentIcon(doc);
                  return (
                    <Link
                      key={doc.id}
                      href={`/documents/${doc.id}`}
                      className="flex items-center gap-2 px-3 py-2 bg-[#F0F0F0] border border-[#E0E0E0] rounded-md text-sm hover:bg-[#E8E8E8] hover:border-[#D0D0D0] transition-colors"
                    >
                      <IconComponent className="w-4 h-4 text-[#444444]" strokeWidth={1.5} />
                      <span className="text-[#0F0F0F] font-medium">{doc.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Danger zone */}
        <div className="pt-8 border-t border-[#E8E8E8]">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#6B6B6B]">Supprimer cette variable</span>
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

      {/* Edit modal */}
      <VariableFormModal
        isOpen={isEditModalOpen}
        variable={variable}
        documents={documents}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditVariable}
      />

      {/* Delete modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteVariable}
        title="Supprimer cette variable"
        message="Cette action est irréversible. La variable ne sera plus disponible pour l'extraction."
      />
    </div>
  );
}
