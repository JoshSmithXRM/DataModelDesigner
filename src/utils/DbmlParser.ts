import {
  DbmlSchema,
  DbmlTable,
  DbmlColumn,
  DbmlRelationship,
} from "../types/DbmlTypes";

export default class DbmlParser {
  private relationships: DbmlRelationship[] = [];

  parse(dbmlText: string): DbmlSchema {
    // Reset relationships for each parse
    this.relationships = [];
    
    const schema: DbmlSchema = {
      tables: [],
      relationships: [],
      indexes: [],
    };

    // Remove comments and normalize whitespace
    const cleanText = this.cleanText(dbmlText);

    // Parse tables
    const tableMatches = cleanText.match(/Table\s+(\w+)\s*{([^}]*)}/g);

    if (tableMatches) {
      for (const tableMatch of tableMatches) {
        const table = this.parseTable(tableMatch);
        if (table) {
          schema.tables.push(table);
        }
      }
    }    // Parse relationships
    const relationshipMatches = cleanText.match(
      /Ref:\s*(\w+)\.(\w+)\s*([<>-]+)\s*(\w+)\.(\w+)/g
    );
    if (relationshipMatches) {
      for (const relMatch of relationshipMatches) {
        const relationship = this.parseRelationship(relMatch);
        if (relationship) {
          schema.relationships.push(relationship);
        }
      }
    }

    // Add relationships collected from inline ref: attributes
    schema.relationships.push(...this.relationships);

    return schema;
  }
  private cleanText(text: string): string {
    // Remove single-line comments
    text = text.replace(/\/\/.*$/gm, "");

    // Remove multi-line comments
    text = text.replace(/\/\*[\s\S]*?\*\//g, "");

    // Normalize whitespace but preserve newlines
    text = text.replace(/[ \t]+/g, " "); // Replace tabs and multiple spaces with single space
    text = text.replace(/\n\s*/g, "\n"); // Clean up newlines but keep them
    text = text.trim();

    return text;
  }

  private parseTable(tableText: string): DbmlTable | null {
    const tableNameMatch = tableText.match(/Table\s+(\w+)/);
    if (!tableNameMatch) return null;

    const tableName = tableNameMatch[1];
    const table: DbmlTable = {
      name: tableName,
      columns: [],
    };

    // Extract table body
    const bodyMatch = tableText.match(/{([^}]*)}/);
    if (!bodyMatch) return table;
    const body = bodyMatch[1]; // Parse columns - split by newlines and filter out empty lines
    const columnLines = body
      .split(/\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    for (const line of columnLines) {
      const column = this.parseColumn(line, tableName);
      if (column) {
        table.columns.push(column);
      }
    }

    return table;
  }

  private parseColumn(line: string, tableName: string): DbmlColumn | null {
    // Match column definition: name type [attributes]
    const columnMatch = line.match(/^(\w+)\s+(\w+)(?:\s*\[(.*?)\])?/);
    if (!columnMatch) return null;

    const [, name, type, attributes] = columnMatch;
    const column: DbmlColumn = {
      name,
      type,
    };

    // Parse attributes
    if (attributes) {
      if (attributes.includes("pk") || attributes.includes("primary key")) {
        column.primaryKey = true;
      }
      if (attributes.includes("not null")) {
        column.notNull = true;
      }
      if (attributes.includes("unique")) {
        column.unique = true;
      }

      // Parse default value
      const defaultMatch = attributes.match(/default:\s*['"]?([^'";\s]+)['"]?/);
      if (defaultMatch) {
        column.defaultValue = defaultMatch[1];
      }

      // Parse inline ref: attributes and create relationships
      const refMatch = attributes.match(/ref:\s*([<>-]+)\s*(\w+)\.(\w+)/);
      if (refMatch) {
        const [, relationSymbol, targetTable, targetColumn] = refMatch;

        // Create relationship based on the symbol
        let type: DbmlRelationship["type"];
        switch (relationSymbol.trim()) {
          case "-":
            type = "one-to-one";
            break;
          case "<":
            type = "many-to-one";
            break;
          case ">":
            type = "one-to-many";
            break;
          case "<>":
            type = "many-to-many";
            break;
          default:
            type = "one-to-many";
        }        // Add the relationship to our global relationships array
        this.relationships.push({
          fromTable: tableName,
          fromColumn: name,
          toTable: targetTable,
          toColumn: targetColumn,
          type,
        });
      }
    }

    return column;
  }

  private parseRelationship(relationshipText: string): DbmlRelationship | null {
    const relMatch = relationshipText.match(
      /Ref:\s*(\w+)\.(\w+)\s*([<>-]+)\s*(\w+)\.(\w+)/
    );
    if (!relMatch) return null;

    const [, fromTable, fromColumn, relationSymbol, toTable, toColumn] =
      relMatch;

    let type: DbmlRelationship["type"];
    switch (relationSymbol.trim()) {
      case "-":
        type = "one-to-one";
        break;
      case "<":
        type = "many-to-one";
        break;
      case ">":
        type = "one-to-many";
        break;
      case "<>":
        type = "many-to-many";
        break;
      default:
        type = "one-to-many";
    }

    return {
      type,
      fromTable,
      fromColumn,
      toTable,
      toColumn,
    };
  }
}
