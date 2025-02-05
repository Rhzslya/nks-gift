import React from "react";
import MyPagination from "@/utils/Pagination";

// Definisikan tipe props untuk PaginationToolbar
interface PaginationToolbarProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

const PaginationToolbar: React.FC<PaginationToolbarProps> = ({
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  return (
    <MyPagination
      currentPage={currentPage}
      pageNumbers={Array.from({ length: totalPages }, (_, i) => i + 1)}
      onPageChange={setCurrentPage}
    />
  );
};

export default PaginationToolbar;
