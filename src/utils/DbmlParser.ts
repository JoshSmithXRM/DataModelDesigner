import {
  DbmlSchema,
  DbmlTable,
  DbmlColumn,
  DbmlRelationship,
} from "../types/DbmlTypes";

export default class DbmlParser {
  parse(dbmlText: string): DbmlSchema {
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
    }

    // Parse relationships
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
      const column = this.parseColumn(line);
      if (column) {
        table.columns.push(column);
      }
    }

    return table;
  }

  private parseColumn(columnText: string): DbmlColumn | null {
    // Basic column parsing: name type [attributes]
    const columnMatch = columnText.match(/(\w+)\s+(\w+(?:\(\d+\))?)\s*(.*)?/);

    if (!columnMatch) {
      console.log("No match found for column:", columnText);
      return null;
    }

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

      // Parse note
      const noteMatch = attributes.match(/note:\s*['"]([^'"]+)['"]/);
      if (noteMatch) {
        column.note = noteMatch[1];
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
