import { DocumentType, Variable } from './types';

export type MentionType = 'doc' | 'var';

export interface ParsedMention {
  type: MentionType;
  id: string;
  name: string;
}

// Parse a token like @[doc:1] or @[var:v1] and return the mention info
export function parseMentionToken(token: string, documents: DocumentType[], variables: Variable[]): ParsedMention | null {
  const match = token.match(/@\[(doc|var):([^\]]+)\]/);
  if (!match) return null;

  const type = match[1] as MentionType;
  const id = match[2];

  if (type === 'doc') {
    const doc = documents.find(d => d.id === id);
    return doc ? { type, id, name: doc.name } : null;
  } else {
    const variable = variables.find(v => v.id === id);
    return variable ? { type, id, name: variable.name } : null;
  }
}

// Convert raw content with tokens to an array of text and mention objects
export interface ContentPart {
  type: 'text' | 'mention';
  content: string;
  mentionType?: MentionType;
  mentionId?: string;
  mentionName?: string;
}

export function parseContent(content: string, documents: DocumentType[], variables: Variable[]): ContentPart[] {
  const parts: ContentPart[] = [];
  const regex = /@\[(doc|var):([^\]]+)\]/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex, match.index),
      });
    }

    // Parse the mention
    const mentionType = match[1] as MentionType;
    const mentionId = match[2];
    let mentionName = match[0]; // fallback to raw token

    if (mentionType === 'doc') {
      const doc = documents.find(d => d.id === mentionId);
      if (doc) mentionName = doc.name;
    } else {
      const variable = variables.find(v => v.id === mentionId);
      if (variable) mentionName = variable.name;
    }

    parts.push({
      type: 'mention',
      content: match[0],
      mentionType,
      mentionId,
      mentionName,
    });

    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    parts.push({
      type: 'text',
      content: content.slice(lastIndex),
    });
  }

  return parts;
}

// Create a mention token from type and id
export function createMentionToken(type: MentionType, id: string): string {
  return `@[${type}:${id}]`;
}

// Check if a line is a header (starts with #)
export function isHeaderLine(line: string): boolean {
  return line.trimStart().startsWith('# ');
}

// Extract header text from a header line
export function extractHeaderText(line: string): string {
  return line.trimStart().replace(/^#\s*/, '');
}
