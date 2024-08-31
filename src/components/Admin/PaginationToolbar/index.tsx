import React from "react";
import MyPagination from "@/utils/Pagination";

// Definisikan tipe props untuk PaginationToolbar
interface PaginationToolbarProps {
  usersPerPage: number;
  handleUsersPerPage: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  items: any[]; // Anda dapat mengganti any dengan tipe data yang lebih spesifik jika ada
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

const PaginationToolbar: React.FC<PaginationToolbarProps> = ({
  usersPerPage,
  handleUsersPerPage,
  items,
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  return (
    <div className="py-2 px-2 flex justify-between items-center">
      <div className="pr-10 text-xs text-gray-500">
        <p>
          Rows per page
          <select
            value={usersPerPage}
            onChange={(e) => {
              handleUsersPerPage(e);
            }}
            className="ml-2 border rounded text-xs"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>{" "}
          of {items?.length} items
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
