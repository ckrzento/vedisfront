export interface DocumentType {
  id: string;
  name: string;
  description?: string;
  icon: string;
  isExternal?: boolean;
  dependsOn?: string[];
}

export interface Field {
  id: string;
  documentTypeId: string;
  name: string;
  description?: string;
  required: boolean;
  isSystem: boolean;
}

export interface Variable {
  id: string;
  name: string;
  description?: string;
  documentIds: string[];
}

export interface RulesConfig {
  content: string;
  updatedAt: Date;
}
