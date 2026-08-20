import React from "react";

interface Column {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  width?: string;
}

interface ReportTableProps {
  columns: Column[];
  rows: Record<string, React.ReactNode>[];
  /** Start row numbering from this value (default: 1) */
  startNumber?: number;
}

/**
 * Formal report table with auto-numbered rows, clean borders,
 * and print-friendly styling.
 */
export function ReportTable({
  columns,
  rows,
  startNumber = 1,
}: ReportTableProps) {
  if (rows.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-gray-400 italic">
        No records found.
      </div>
    );
  }

  return (
    <table
      className="w-full border-collapse text-xs"
      role="table"
    >
      <thead>
        <tr className="bg-[#e8f0eb]">
          <th
            scope="col"
            className="border border-gray-300 px-2 py-2 text-left font-bold text-gray-700 w-[40px]"
          >
            #
          </th>
          {columns.map((col) => (
            <th
              key={col.key}
              scope="col"
              className={`border border-gray-300 px-2 py-2 font-bold text-gray-700 ${
                col.align === "center"
                  ? "text-center"
                  : col.align === "right"
                    ? "text-right"
                    : "text-left"
              }`}
              style={col.width ? { width: col.width } : undefined}
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr
            key={row.id as string ?? index}
            className={index % 2 === 1 ? "bg-gray-50" : "bg-white"}
          >
            <td className="border border-gray-300 px-2 py-1.5 text-gray-600 text-center">
              {startNumber + index}
            </td>
            {columns.map((col) => (
              <td
                key={col.key}
                className={`border border-gray-300 px-2 py-1.5 text-gray-800 ${
                  col.align === "center"
                    ? "text-center"
                    : col.align === "right"
                      ? "text-right"
                      : "text-left"
                }`}
              >
                {row[col.key] ?? "—"}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
