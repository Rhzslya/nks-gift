import React from "react";

interface TableHeaderProps {
  tableHeaders: { key: string; name: string }[];
  hasStockHeader: boolean;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  tableHeaders,
  hasStockHeader,
}) => {
  return (
    <thead className="bg-white border-b-2 border-gray-100">
      <tr>
        {tableHeaders.map((header) => (
          <th
            key={header.key}
            colSpan={header.key === "stock" && hasStockHeader ? 2 : undefined}
            rowSpan={header.key !== "stock" ? 2 : undefined}
            scope="col"
            className={`px-4 py-2 text-center text-sm font-medium text-gray-500 uppercase tracking-wider ${
              header.key === "action" ? "hidden" : ""
            }`}
          >
            {header.name}
          </th>
        ))}
        <th
          rowSpan={2}
          className={`px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider ${
            tableHeaders.some((header) => header.key === "action")
              ? ""
              : "hidden"
          }`}
        >
          {/* Action column header text */}
        </th>
      </tr>
      {hasStockHeader && (
        <tr>
          <th className="px-4 py-2 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
            Variant
          </th>
          <th className="px-4 py-2 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
            Quantity
          </th>
        </tr>
      )}
    </thead>
  );
};

export default TableHeader;
