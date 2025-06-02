import DbmlParser from "./src/utils/DbmlParser.js";

const testDbml = `Table users {
  id integer [primary key]
  username varchar
  email varchar [unique, not null]
  created_at timestamp [default: "now()"]
  role_id integer
}

Table roles {
  id integer [primary key]
  name varchar [not null]
  description text
}`;

const parser = new DbmlParser();
const schema = parser.parse(testDbml);

console.log("Parsed Schema:");
console.log(JSON.stringify(schema, null, 2));

schema.tables.forEach((table) => {
  console.log(`\nTable: ${table.name}`);
  console.log(`Columns (${table.columns.length}):`);
  table.columns.forEach((col) => {
    console.log(`  - ${col.name}: ${col.type}${col.primaryKey ? " (PK)" : ""}`);
  });
});
