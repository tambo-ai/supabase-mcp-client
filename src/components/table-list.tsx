import React from "react";

export interface TableRelationship {
  id: number;
  source_schema: string;
  constraint_name: string;
  source_table_name: string;
  target_table_name: string;
  source_column_name: string;
  target_column_name: string;
  target_table_schema: string;
}

export interface TablePrimaryKey {
  name?: string;
  schema?: string;
  table_id?: number;
  table_name?: string;
}

export interface Table {
  id?: number;
  schema?: string;
  name?: string;
  rls_enabled?: boolean;
  rls_forced?: boolean;
  replica_identity?: string;
  bytes?: number;
  size?: string;
  live_rows_estimate?: number;
  dead_rows_estimate?: number;
  comment?: string | null;
  primary_keys?: TablePrimaryKey[];
  relationships?: TableRelationship[];
}

interface TableListProps {
  tables: Table[];
}

export const TableList: React.FC<TableListProps> = ({ tables = [] }) => {
  return (
    <div className="grid gap-4 w-full max-w-xl">
      {tables.map((table) => (
        <div
          key={table.id}
          className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{table.name}</h2>
              <p className="text-sm text-gray-500">{table.schema}</p>
            </div>
            <div className="flex gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  table.rls_enabled
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                RLS {table.rls_enabled ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>

          <div className="grid gap-3 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-500">Size:</span>
                <span className="ml-2 font-mono">{table.size}</span>
              </div>
              <div>
                <span className="text-gray-500">Rows:</span>
                <span className="ml-2 font-mono">
                  {table.live_rows_estimate}
                </span>
              </div>
            </div>

            {table.primary_keys && table.primary_keys.length > 0 && (
              <div>
                <span className="text-gray-500">Primary Keys:</span>
                <div className="mt-1 font-mono">
                  {table.primary_keys.map((pk) => pk.name).join(", ")}
                </div>
              </div>
            )}

            {table.relationships && table.relationships.length > 0 && (
              <div>
                <span className="text-gray-500">Relationships:</span>
                <div className="mt-1 space-y-1">
                  {table.relationships.map((rel) => (
                    <div
                      key={rel.id}
                      className="font-mono text-xs bg-gray-50 p-2 rounded"
                    >
                      {rel.source_table_name}.{rel.source_column_name} →{" "}
                      {rel.target_table_schema}.{rel.target_table_name}.
                      {rel.target_column_name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
