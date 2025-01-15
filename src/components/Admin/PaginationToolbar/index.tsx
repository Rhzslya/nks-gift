import React from "react";
import MyPagination from "@/utils/Pagination";

// Definisikan tipe props untuk PaginationToolbar
interface PaginationToolbarProps {
  usersPerPage: number;
  handleUsersPerPage: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  items: number;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  rowsPerPageOptions?: number[];
}

const PaginationToolbar: React.FC<PaginationToolbarProps> = ({
  usersPerPage,
  handleUsersPerPage,
  items,
  currentPage,
  totalPages,
  setCurrentPage,
  rowsPerPageOptions = [5, 10, 15],
}) => {
  return (
    <div className="relative py-2 px-2 flex justify-between items-center">
      <div className="pr-10 text-xs text-gray-500">
        <p>
          Items per page
          <select
            value={usersPerPage}
            onChange={(e) => {
              handleUsersPerPage(e);
            }}
            className="ml-2 border rounded text-xs"
          >
            {rowsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>{" "}
          of {items} items
        </p>
      </div>
      <MyPagination
        currentPage={currentPage}
        pageNumbers={Array.from({ length: totalPages }, (_, i) => i + 1)}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default PaginationToolbar;
