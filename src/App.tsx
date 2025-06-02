import React, { useState, useCallback } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  Connection,
  Edge,
  Node,
} from "reactflow";
import TableNode from "./components/TableNode";
import Toolbar from "./components/Toolbar";
import DbmlParser from "./utils/DbmlParser";
import { DbmlSchema } from "./types/DbmlTypes";

import "reactflow/dist/style.css";

const nodeTypes = {
  table: TableNode,
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [dbmlInput, setDbmlInput] = useState("");
  const [parsedSchema, setParsedSchema] = useState<DbmlSchema | null>(null);

  const getRelationshipLabel = (relType: string): string => {
    switch (relType) {
      case "one-to-one":
        return "1:1";
      case "one-to-many":
        return "1:N";
      case "many-to-one":
        return "N:1";
      case "many-to-many":
        return "N:N";
      default:
        return "1:N";
    }
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleDbmlParse = useCallback(() => {
    try {
      const parser = new DbmlParser();
      const schema = parser.parse(dbmlInput);
      setParsedSchema(schema);

      // Convert parsed schema to React Flow nodes
      const newNodes = schema.tables.map((table, index) => ({
        id: table.name,
        type: "table",
        position: {
          x: 100 + (index % 3) * 300,
          y: 100 + Math.floor(index / 3) * 200,
        },
        data: { table },
      })); // Convert relationships to edges
      const newEdges = schema.relationships.map((rel, index) => ({
        id: `rel-${index}`,
        source: rel.fromTable,
        target: rel.toTable,
        sourceHandle: rel.fromColumn,
        targetHandle: rel.toColumn,
        label: getRelationshipLabel(rel.type),
        type: "smoothstep",
        labelStyle: {
          backgroundColor: "#22C55E",
          color: "white",
          padding: "2px 6px",
          borderRadius: "4px",
          fontSize: "12px",
          fontWeight: "bold",
        },
        labelBgStyle: {
          fill: "#A9A9A9",
        },
        style: {
          stroke: "#A9A9A9",
          strokeWidth: 2,
        },
      }));

      setNodes(newNodes);
      setEdges(newEdges);
    } catch (error) {
      console.error("Failed to parse DBML:", error);
      alert("Failed to parse DBML. Please check your syntax.");
    }
  }, [dbmlInput, setNodes, setEdges]);
  const handleExport = useCallback(() => {
    const exportData = {
      dbml: dbmlInput,
      schema: parsedSchema,
      layout: {
        nodes: nodes.map((node) => ({
          id: node.id,
          position: node.position,
        })),
        edges: edges.map((edge) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
        })),
      },
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data-model.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [dbmlInput, parsedSchema, nodes, edges]);

  const handleImport = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importData = JSON.parse(e.target?.result as string);

          // Validate the imported data structure
          if (!importData.dbml || !importData.schema || !importData.layout) {
            alert(
              "Invalid file format. Please select a valid data model export file."
            );
            return;
          }

          // Restore DBML input
          setDbmlInput(importData.dbml);
          setParsedSchema(importData.schema);

          // Restore nodes with positions
          const importedNodes = importData.schema.tables.map((table: any) => {
            const layoutNode = importData.layout.nodes.find(
              (n: any) => n.id === table.name
            );
            return {
              id: table.name,
              type: "table",
              position: layoutNode ? layoutNode.position : { x: 100, y: 100 },
              data: { table },
            };
          }); // Restore edges
          const importedEdges = importData.schema.relationships.map(
            (rel: any, index: number) => ({
              id: `rel-${index}`,
              source: rel.fromTable,
              target: rel.toTable,
              sourceHandle: rel.fromColumn,
              targetHandle: rel.toColumn,
              label: getRelationshipLabel(rel.type),
              type: "smoothstep",
              labelStyle: {
                backgroundColor: "#22C55E",
                color: "white",
                padding: "2px 6px",
                borderRadius: "4px",
                fontSize: "12px",
                fontWeight: "bold",
              },
              labelBgStyle: {
                fill: "#22C55E",
              },
              style: {
                stroke: "#22C55E",
                strokeWidth: 2,
              },
            })
          );

          setNodes(importedNodes);
          setEdges(importedEdges);

          console.log("Data model imported successfully");
        } catch (error) {
          console.error("Failed to import data model:", error);
          alert("Failed to import data model. Please check the file format.");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, [setDbmlInput, setParsedSchema, setNodes, setEdges]);

  return (
    <div className="h-screen flex flex-col">
      {" "}
      <Toolbar
        dbmlInput={dbmlInput}
        onDbmlInputChange={setDbmlInput}
        onParse={handleDbmlParse}
        onExport={handleExport}
        onImport={handleImport}
      />
      <div className="flex-1">
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            className="bg-gray-50"
          >
            <Controls />
            <MiniMap />
            <Background gap={12} size={1} />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </div>
  );
}

export default App;
