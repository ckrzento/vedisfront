'use client';

import React, { useEffect, useRef, useCallback, useState, useMemo, forwardRef, useImperativeHandle } from 'react';
import { useEditor, EditorContent, ReactRenderer } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { HelpCircle, FileText, Variable } from 'lucide-react';
import { DocumentType, Variable as VariableType } from '@/lib/types';
import { CustomMention, MentionType, MentionItem } from './mention-extension';
import { SaveIndicator, SaveStatus } from './save-indicator';
import { HelpDrawer } from './help-drawer';
import tippy, { Instance } from 'tippy.js';

interface RulesEditorProps {
  initialContent: string;
  documents: DocumentType[];
  variables: VariableType[];
  onSave: (content: string) => Promise<void>;
}

// Convert storage format to TipTap HTML
function parseFromStorage(
  content: string,
  documents: DocumentType[],
  variables: VariableType[]
): string {
  let html = content;

  // Replace document mentions
  html = html.replace(/@\[doc:([^\]]+)\]/g, (_, id) => {
    const doc = documents.find(d => d.id === id);
    const name = doc?.name || id;
    return `<span data-mention data-id="${id}" data-type="doc" data-label="${name}" class="mention mention-document">${name}</span>`;
  });

  // Replace variable mentions
  html = html.replace(/@\[var:([^\]]+)\]/g, (_, id) => {
    const variable = variables.find(v => v.id === id);
    const name = variable?.name || id;
    return `<span data-mention data-id="${id}" data-type="var" data-label="${name}" class="mention mention-variable">${name}</span>`;
  });

  // Convert markdown headers to HTML
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Convert line breaks to paragraphs
  const lines = html.split('\n');
  const paragraphs = lines.map(line => {
    if (line.startsWith('<h1>')) return line;
    if (line.trim() === '') return '<p></p>';
    return `<p>${line}</p>`;
  });

  return paragraphs.join('');
}

// Convert TipTap HTML to storage format
function serializeToStorage(html: string): string {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  const processNode = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || '';
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;

      if (element.hasAttribute('data-mention')) {
        const type = element.getAttribute('data-type') as MentionType;
        const id = element.getAttribute('data-id');
        return `@[${type}:${id}]`;
      }

      if (element.tagName === 'H1') {
        const childContent = Array.from(element.childNodes)
          .map(processNode)
          .join('');
        return `# ${childContent}`;
      }

      if (element.tagName === 'P') {
        const childContent = Array.from(element.childNodes)
          .map(processNode)
          .join('');
        return childContent;
      }

      if (element.tagName === 'BR') {
        return '';
      }

      return Array.from(element.childNodes).map(processNode).join('');
    }

    return '';
  };

  const result = Array.from(tempDiv.childNodes)
    .map(processNode)
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return result;
}

// Mention List Component with two-step selection
interface MentionListProps {
  items: MentionItem[];
  command: (item: MentionItem) => void;
}

interface MentionListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

type Step = 'select-type' | 'select-item';

const MentionList = forwardRef<MentionListRef, MentionListProps>(({ items, command }, ref) => {
  const [step, setStep] = useState<Step>('select-type');
  const [selectedType, setSelectedType] = useState<MentionType | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter items based on selected type and search
  const filteredItems = useMemo(() => {
    if (!selectedType) return [];
    const typeItems = items.filter(i => i.type === selectedType);
    if (!searchQuery) return typeItems;
    return typeItems.filter(i =>
      i.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [items, selectedType, searchQuery]);

  const selectItem = (index: number) => {
    const item = filteredItems[index];
    if (item) {
      command(item);
    }
  };

  const selectType = (type: MentionType) => {
    setSelectedType(type);
    setStep('select-item');
    setSelectedIndex(0);
    setSearchQuery('');
    setTimeout(() => searchInputRef.current?.focus(), 0);
  };

  const goBack = () => {
    setStep('select-type');
    setSelectedType(null);
    setSelectedIndex(0);
    setSearchQuery('');
  };

  // Reset when items change (new @ typed)
  useEffect(() => {
    setStep('select-type');
    setSelectedType(null);
    setSelectedIndex(0);
    setSearchQuery('');
  }, []);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'Escape') {
        if (step === 'select-item') {
          goBack();
          return true;
        }
        return false;
      }

      if (step === 'select-type') {
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
          setSelectedIndex(prev => prev === 0 ? 1 : 0);
          return true;
        }
        if (event.key === 'Enter') {
          selectType(selectedIndex === 0 ? 'doc' : 'var');
          return true;
        }
      } else {
        if (event.key === 'ArrowUp') {
          setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
          return true;
        }
        if (event.key === 'ArrowDown') {
          setSelectedIndex(prev => (prev + 1) % filteredItems.length);
          return true;
        }
        if (event.key === 'Enter' && filteredItems.length > 0) {
          selectItem(selectedIndex);
          return true;
        }
        if (event.key === 'Backspace' && searchQuery === '') {
          goBack();
          return true;
        }
      }

      return false;
    },
  }));

  // Step 1: Select type
  if (step === 'select-type') {
    return (
      <div className="mention-list">
        <button
          className={`mention-list-type-btn ${selectedIndex === 0 ? 'is-selected' : ''}`}
          onClick={() => selectType('doc')}
          onMouseEnter={() => setSelectedIndex(0)}
        >
          <div className="mention-list-type-icon mention-list-type-icon-doc">
            <FileText className="w-4 h-4" />
          </div>
          <div className="mention-list-type-text">
            <span className="mention-list-type-title">Document</span>
            <span className="mention-list-type-desc">Référencer un document</span>
          </div>
        </button>
        <button
          className={`mention-list-type-btn ${selectedIndex === 1 ? 'is-selected' : ''}`}
          onClick={() => selectType('var')}
          onMouseEnter={() => setSelectedIndex(1)}
        >
          <div className="mention-list-type-icon mention-list-type-icon-var">
            <Variable className="w-4 h-4" />
          </div>
          <div className="mention-list-type-text">
            <span className="mention-list-type-title">Variable</span>
            <span className="mention-list-type-desc">Référencer une variable</span>
          </div>
        </button>
      </div>
    );
  }

  // Step 2: Select item from list
  return (
    <div className="mention-list">
      <div className="mention-list-header-back">
        <button onClick={goBack} className="mention-list-back-btn">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span>{selectedType === 'doc' ? 'Documents' : 'Variables'}</span>
      </div>

      <div className="mention-list-search">
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mention-list-search-input"
        />
      </div>

      <div className="mention-list-items">
        {filteredItems.length === 0 ? (
          <div className="mention-list-empty">Aucun résultat</div>
        ) : (
          filteredItems.map((item, idx) => (
            <button
              key={`${item.type}-${item.id}`}
              className={`mention-list-item ${idx === selectedIndex ? 'is-selected' : ''}`}
              onClick={() => selectItem(idx)}
              onMouseEnter={() => setSelectedIndex(idx)}
            >
              <span className={`mention-badge ${item.type === 'doc' ? 'mention-document' : 'mention-variable'}`}>
                {item.name}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
});

MentionList.displayName = 'MentionList';

// Inner editor component that uses TipTap
function TipTapEditor({
  initialContent,
  documents,
  variables,
  onContentChange,
}: {
  initialContent: string;
  documents: DocumentType[];
  variables: VariableType[];
  onContentChange: (content: string) => void;
}) {
  // Create suggestion config
  const suggestionConfig = useMemo(() => ({
    items: ({ query }: { query: string }): MentionItem[] => {
      const lowerQuery = query.toLowerCase();

      const docItems: MentionItem[] = documents
        .filter(d => d.name.toLowerCase().includes(lowerQuery))
        .map(d => ({ id: d.id, name: d.name, type: 'doc' as MentionType }));

      const varItems: MentionItem[] = variables
        .filter(v => v.name.toLowerCase().includes(lowerQuery))
        .map(v => ({ id: v.id, name: v.name, type: 'var' as MentionType }));

      return [...docItems, ...varItems];
    },

    render: () => {
      let component: ReactRenderer | null = null;
      let popup: Instance[] | null = null;

      return {
        onStart: (props: { editor: unknown; clientRect: (() => DOMRect) | null; command: (item: MentionItem) => void }) => {
          component = new ReactRenderer(MentionList, {
            props: {
              ...props,
              command: (item: MentionItem) => {
                props.command({
                  id: item.id,
                  type: item.type,
                  label: item.name,
                } as unknown as MentionItem);
              },
            },
            editor: props.editor as Parameters<typeof ReactRenderer>[1]['editor'],
          });

          if (!props.clientRect) {
            return;
          }

          popup = tippy('body', {
            getReferenceClientRect: props.clientRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: 'manual',
            placement: 'bottom-start',
            offset: [0, 8],
          });
        },

        onUpdate(props: { clientRect: (() => DOMRect) | null }) {
          component?.updateProps(props);

          if (!props.clientRect) {
            return;
          }

          popup?.[0]?.setProps({
            getReferenceClientRect: props.clientRect,
          });
        },

        onKeyDown(props: { event: KeyboardEvent }) {
          if (props.event.key === 'Escape') {
            popup?.[0]?.hide();
            return true;
          }

          return (component?.ref as MentionListRef | null)?.onKeyDown?.(props) ?? false;
        },

        onExit() {
          popup?.[0]?.destroy();
          component?.destroy();
        },
      };
    },
  }), [documents, variables]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1],
        },
      }),
      Placeholder.configure({
        placeholder: 'Écrivez vos règles ici... Tapez @ pour mentionner un document ou une variable.',
      }),
      CustomMention.configure({
        suggestion: suggestionConfig,
      }),
    ],
    content: parseFromStorage(initialContent, documents, variables),
    editorProps: {
      attributes: {
        class: 'rules-editor',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const serialized = serializeToStorage(html);
      onContentChange(serialized);
    },
  });

  return <EditorContent editor={editor} />;
}

// Main exported component
export function RulesEditor({
  initialContent,
  documents,
  variables,
  onSave,
}: RulesEditorProps) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [showHelp, setShowHelp] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedContentRef = useRef(initialContent);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const handleContentChange = useCallback((content: string) => {
    if (content === lastSavedContentRef.current) return;

    setSaveStatus('unsaved');

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        await onSave(content);
        lastSavedContentRef.current = content;
        setSaveStatus('saved');
      } catch {
        setSaveStatus('unsaved');
      }
    }, 1000);
  }, [onSave]);

  return (
    <div className="flex flex-col h-full">
      {/* Header with title, subtitle, and actions */}
      <div className="px-6 py-4 bg-white border-b border-[#E8E8E8]">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[16px] font-semibold text-[#0F0F0F]">Règles de validation</h2>
            <p className="text-[14px] text-[#6B7280] mt-1">
              Ces règles définissent les critères de validation des dossiers de financement.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <SaveIndicator status={saveStatus} />
            <button
              onClick={() => setShowHelp(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#6B6B6B] hover:text-[#0F0F0F] hover:bg-[#F5F5F5] rounded-md transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Aide</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-white">
        <style jsx global>{`
          .rules-editor {
            min-height: 500px;
            padding: 24px;
            font-size: 15px;
            line-height: 1.7;
            outline: none;
          }

          .rules-editor:focus {
            outline: none;
          }

          .rules-editor h1 {
            font-size: 18px;
            font-weight: 600;
            margin-top: 24px;
            margin-bottom: 12px;
            color: #0F0F0F;
          }

          .rules-editor h1:first-child {
            margin-top: 0;
          }

          .rules-editor p {
            margin: 0;
            min-height: 1.7em;
          }

          .rules-editor .is-editor-empty:first-child::before {
            content: attr(data-placeholder);
            float: left;
            color: #9CA3AF;
            pointer-events: none;
            height: 0;
          }

          .mention {
            border-radius: 4px;
            padding: 2px 8px;
            font-weight: 500;
            white-space: nowrap;
            display: inline;
          }

          .mention-document {
            background-color: #DEF7DE;
            color: #1D6D1D;
          }

          .mention-variable {
            background-color: #DBEAFE;
            color: #1E40AF;
          }

          .mention-list {
            width: 280px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            padding: 4px;
            overflow: hidden;
          }

          .mention-list-type-btn {
            display: flex;
            align-items: center;
            gap: 12px;
            width: 100%;
            padding: 12px;
            border: none;
            background: none;
            cursor: pointer;
            text-align: left;
            border-radius: 6px;
            transition: background-color 0.15s;
          }

          .mention-list-type-btn:hover,
          .mention-list-type-btn.is-selected {
            background-color: #F5F5F5;
          }

          .mention-list-type-icon {
            width: 36px;
            height: 36px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .mention-list-type-icon-doc {
            background-color: #DEF7DE;
            color: #1D6D1D;
          }

          .mention-list-type-icon-var {
            background-color: #DBEAFE;
            color: #1E40AF;
          }

          .mention-list-type-text {
            display: flex;
            flex-direction: column;
            gap: 2px;
          }

          .mention-list-type-title {
            font-size: 14px;
            font-weight: 500;
            color: #0F0F0F;
          }

          .mention-list-type-desc {
            font-size: 12px;
            color: #6B6B6B;
          }

          .mention-list-header-back {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            font-size: 14px;
            font-weight: 600;
            color: #0F0F0F;
            border-bottom: 1px solid #E8E8E8;
          }

          .mention-list-back-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            border: none;
            background: none;
            cursor: pointer;
            border-radius: 4px;
            color: #6B6B6B;
            transition: background-color 0.15s, color 0.15s;
          }

          .mention-list-back-btn:hover {
            background-color: #F5F5F5;
            color: #0F0F0F;
          }

          .mention-list-search {
            padding: 8px;
            border-bottom: 1px solid #E8E8E8;
          }

          .mention-list-search-input {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #E8E8E8;
            border-radius: 6px;
            font-size: 14px;
            outline: none;
            transition: border-color 0.15s;
          }

          .mention-list-search-input:focus {
            border-color: #0F0F0F;
          }

          .mention-list-items {
            max-height: 240px;
            overflow-y: auto;
            padding: 4px;
          }

          .mention-list-item {
            display: flex;
            align-items: center;
            width: 100%;
            padding: 8px 12px;
            border: none;
            background: none;
            cursor: pointer;
            text-align: left;
            border-radius: 4px;
            transition: background-color 0.15s;
          }

          .mention-list-item:hover,
          .mention-list-item.is-selected {
            background-color: #F5F5F5;
          }

          .mention-list-empty {
            padding: 16px;
            text-align: center;
            color: #6B6B6B;
            font-size: 14px;
          }

          .mention-badge {
            border-radius: 4px;
            padding: 2px 8px;
            font-weight: 500;
            font-size: 14px;
          }

          .tippy-box {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
          }

          .tippy-content {
            padding: 0 !important;
          }
        `}</style>

        {isMounted ? (
          <TipTapEditor
            initialContent={initialContent}
            documents={documents}
            variables={variables}
            onContentChange={handleContentChange}
          />
        ) : (
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-5 bg-gray-100 rounded w-48"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-100 rounded w-full"></div>
                <div className="h-4 bg-gray-100 rounded w-5/6"></div>
              </div>
              <div className="h-5 bg-gray-100 rounded w-40 mt-6"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-100 rounded w-full"></div>
                <div className="h-4 bg-gray-100 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <HelpDrawer isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}
