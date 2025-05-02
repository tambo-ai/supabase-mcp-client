"use client";

export interface TableData {
  headers: string[];
  rows: string[][];
  striped?: boolean;
  hoverable?: boolean;
}

export const Table = ({
  headers = [],
  rows = [],
  striped = true,
  hoverable = true,
}: TableData) => {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
      <table className="h-full w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            {headers.map((header, index) => (
              <th key={index} scope="col" className="px-6 py-3">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`
                bg-white border-b
                ${striped && rowIndex % 2 === 1 ? "bg-gray-50" : ""}
                ${hoverable ? "hover:bg-gray-100" : ""}
              `}
            >
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-6 py-4">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
