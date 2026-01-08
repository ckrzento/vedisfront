'use client';

import { useState, useMemo, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Button, SearchInput, DocumentListSkeleton } from '@/components/ui';
import {
  DocumentRow,
  NewDocumentModal,
  EmptyDocuments,
  EmptySearch,
} from '@/components/documents';
import { NavTabs } from '@/components/layout/nav-tabs';
import { useDocuments } from '@/hooks/use-documents';

export default function DocumentsPage() {
  const { documents, loading, addDocument } = useDocuments();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

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

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      return doc.name.toLowerCase().includes(debouncedQuery.toLowerCase());
    });
  }, [documents, debouncedQuery]);

  const handleCreateDocument = async (data: { name: string; description: string }) => {
    await addDocument(data);
    toast.success('Document créé avec succès');
  };

  const isLoading = loading || showSkeleton;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-[#0F0F0F]">Documents</h1>
          <Button onClick={() => setIsNewModalOpen(true)} size="sm">
            <Plus className="w-4 h-4" strokeWidth={1.5} />
            Nouveau
          </Button>
        </div>

        {/* Navigation */}
        <div className="mb-6">
          <NavTabs />
        </div>

        {/* Search */}
        <div className="mb-6">
          <SearchInput
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4" strokeWidth={1.5} />}
          />
        </div>

        {/* Document list */}
        {isLoading ? (
          <DocumentListSkeleton />
        ) : documents.length === 0 ? (
          <EmptyDocuments onCreateClick={() => setIsNewModalOpen(true)} />
        ) : filteredDocuments.length === 0 ? (
          <EmptySearch query={debouncedQuery} />
        ) : (
          <div className="bg-white rounded-lg border border-[#E8E8E8] divide-y divide-[#E8E8E8]">
            {filteredDocuments.map((doc) => (
              <DocumentRow key={doc.id} document={doc} />
            ))}
          </div>
        )}
      </div>

      {/* New document modal */}
      <NewDocumentModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSubmit={handleCreateDocument}
      />
    </div>
  );
}
