import React from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { DbmlTable } from "../types/DbmlTypes";

interface TableNodeData {
  table: DbmlTable;
}

const TableNode: React.FC<NodeProps<TableNodeData>> = ({ data }) => {
  const { table } = data;

  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg min-w-[200px]">
      {" "}
      {/* Table Header */}
      <div className="bg-green-500 text-white px-4 py-2 rounded-t-lg font-bold">
        {table.name}
      </div>
      {/* Table Columns */}
      <div className="p-2">
        {table.columns.map((column, index) => (
          <div
            key={column.name}
            className="flex items-center justify-between py-1 px-2 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
          >
            <div className="flex items-center space-x-2">
              {/* Primary Key Icon */}
              {column.primaryKey && (
                <span className="text-yellow-500 font-bold" title="Primary Key">
                  🔑
                </span>
              )}

              {/* Column Name */}
              <span
                className={`font-medium ${
                  column.primaryKey ? "text-blue-600" : "text-gray-800"
                }`}
              >
                {column.name}
              </span>
            </div>

            {/* Column Type */}
            <span className="text-sm text-gray-500 font-mono">
              {column.type}
            </span>

            {/* Connection Handle for each column */}
            <Handle
              type="source"
              position={Position.Right}
              id={column.name}
              style={{
                right: -8,
                top: 32 + index * 32 + 16, // Adjust based on row height
                width: 8,
                height: 8,
                backgroundColor: "#3b82f6",
                border: "2px solid white",
              }}
            />
            <Handle
              type="target"
              position={Position.Left}
              id={column.name}
              style={{
                left: -8,
                top: 32 + index * 32 + 16, // Adjust based on row height
                width: 8,
                height: 8,
                backgroundColor: "#3b82f6",
                border: "2px solid white",
              }}
            />
          </div>
        ))}
      </div>
      {/* Table Note */}
      {table.note && (
        <div className="px-4 py-2 bg-gray-50 text-sm text-gray-600 italic rounded-b-lg">
          {table.note}
        </div>
      )}
    </div>
  );
};

export default TableNode;
