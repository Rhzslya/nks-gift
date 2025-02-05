export default function MyPagination({
  currentPage,
  pageNumbers,
  onPageChange,
}: any) {
  const totalPages = pageNumbers.length;
  let startPage, endPage;

  if (totalPages <= 3) {
    startPage = 1;
    endPage = totalPages;
  } else if (currentPage === 1) {
    startPage = 1;
    endPage = 3;
  } else if (currentPage === totalPages) {
    startPage = totalPages - 2;
    endPage = totalPages;
  } else {
    startPage = currentPage - 1;
    endPage = currentPage + 1;
  }

  const visiblePages = pageNumbers.slice(startPage - 1, endPage);
  return (
    <div className="pagination">
      <ul className="flex justify-center items-center gap-1">
        <li>
          <button
            className={`flex justify-center items-center ${
              currentPage === 1 ? "hidden" : ""
            }`}
            onClick={() => onPageChange(1)}
          >
            <i className="bx bx-chevrons-left text-[28px] text-gray-600 "></i>
          </button>
        </li>
        <li>
          <button
            className={`flex justify-center items-center ${
              currentPage === 1 ? "hidden" : ""
            }`}
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          >
            <i className="bx bx-chevron-left text-[28px] text-gray-600 "></i>
          </button>
        </li>
        {visiblePages.map((page: any) => (
          <li key={page}>
            <button
              className={`flex justify-center items-center px-2 py-[2px] text-gray-600 text-sm font-bold rounded-sm ${
                currentPage === page ? "bg-sky-300 text-white" : "bg-gray-100 "
              }`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          </li>
        ))}
        <li>
          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            className={` flex justify-center items-center ${
              currentPage === totalPages ? "hidden" : ""
            }`}
          >
            <i className="bx bx-chevron-right text-[28px] text-gray-600"></i>
          </button>
        </li>
        <li>
          <button
            className={`flex justify-center items-center ${
              currentPage === totalPages ? "hidden" : ""
            }`}
            onClick={() => onPageChange(totalPages)}
          >
            <i className="bx bx-chevrons-right text-[28px] text-gray-600 "></i>
          </button>
        </li>
      </ul>
    </div>
  );
}
