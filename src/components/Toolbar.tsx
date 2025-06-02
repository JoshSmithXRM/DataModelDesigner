import React from "react";
import { Download, Upload, Play, FileText } from "lucide-react";

interface ToolbarProps {
  dbmlInput: string;
  onDbmlInputChange: (value: string) => void;
  onParse: () => void;
  onExport: () => void;
  onImport: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  dbmlInput,
  onDbmlInputChange,
  onParse,
  onExport,
  onImport,
}) => {
  const sampleDbml = `Table users {
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
}

Table posts {
  id integer [primary key]
  title varchar [not null]
  content text
  author_id integer
  created_at timestamp [default: "now()"]
  updated_at timestamp
}

Ref: users.role_id > roles.id
Ref: users.id < posts.author_id`;

  const loadSample = () => {
    onDbmlInputChange(sampleDbml);
  };

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex flex-col space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
            <FileText className="h-6 w-6" />
            <span>Data Model Designer</span>
          </h1>{" "}
          <div className="flex space-x-2">
            <button
              onClick={loadSample}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm"
            >
              Load Sample
            </button>
            <button
              onClick={onParse}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center space-x-2"
            >
              <Play className="h-4 w-4" />
              <span>Parse DBML</span>
            </button>
            <button
              onClick={onExport}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
            <button
              onClick={onImport}
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors flex items-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>Import</span>
            </button>
          </div>
        </div>

        {/* DBML Input */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <label
              htmlFor="dbml-input"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              DBML Input:
            </label>
            <textarea
              id="dbml-input"
              value={dbmlInput}
              onChange={(e) => onDbmlInputChange(e.target.value)}
              placeholder="Enter your DBML code here..."
              className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
