export interface DocumentType {
  id: string;
  name: string;
  description?: string;
  icon: string;
  isExternal?: boolean;
  dependsOn?: string[];
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
