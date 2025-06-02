export interface DbmlColumn {
  name: string;
  type: string;
  primaryKey?: boolean;
  notNull?: boolean;
  unique?: boolean;
  defaultValue?: string;
  note?: string;
}

export interface DbmlTable {
  name: string;
  alias?: string;
  note?: string;
  columns: DbmlColumn[];
}

export interface DbmlRelationship {
  type: 'one-to-one' | 'one-to-many' | 'many-to-one' | 'many-to-many';
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
}

export interface DbmlIndex {
  table: string;
  columns: string[];
  unique?: boolean;
  name?: string;
}

export interface DbmlSchema {
  tables: DbmlTable[];
  relationships: DbmlRelationship[];
  indexes: DbmlIndex[];
  note?: string;
}

export interface LayoutData {
  nodes: Array<{
    id: string;
    position: { x: number; y: number };
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
  }>;
}

export interface ExportData {
  dbml: string;
  schema: DbmlSchema;
  layout: LayoutData;
}
