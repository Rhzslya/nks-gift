import React, { RefObject } from "react";
import { SortOption } from "@/utils/SortOptions";

interface UtilityBarProps {
  searchTerm: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleToggleFilter: () => void;
  filterButtonRef: RefObject<HTMLButtonElement>;
  isFilterOpen: boolean;
  filterRef: RefObject<HTMLDivElement>;
  isActive: (order: "asc" | "desc", field: any) => boolean;
  handleSortChange: (order: "asc" | "desc", field: any) => void;
  placeholder: string;
  sortOptions: SortOption[];
}

const UtilityBar: React.FC<UtilityBarProps> = ({
  searchTerm,
  handleSearchChange,
  handleToggleFilter,
  filterButtonRef,
  isFilterOpen,
  filterRef,
  isActive,
  handleSortChange,
  placeholder,
  sortOptions,
}) => {
  return (
    <div className="relative py-2 flex items-center">
      <div className="relative pr-10 border-r-2 border-gray-300">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <i className="bx bx-search text-[20px] text-gray-600"></i>
        </span>
        <input
          type="text"
          placeholder={placeholder}
          className="px-2 py-1 border rounded text-sm pl-10 focus:border-sky-300 focus:outline-none"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="relative pl-10">
        <button onClick={handleToggleFilter} ref={filterButtonRef}>
          <i
            className={`bx bx-filter text-[28px] text-gray-500 cursor-pointer rounded-md hover:bg-gray-200 duration-300 ${
              isFilterOpen && "bg-gray-200"
            }`}
          ></i>
        </button>

        {isFilterOpen && (
          <div
            ref={filterRef}
            className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50"
          >
            {sortOptions.map((option) => (
              <button
                key={`${option.field}-${option.order}`}
                className={`block px-4 py-2 text-xs text-gray-500 hover:bg-gray-100 w-full text-left ${
                  isActive(option.order, option.field) &&
                  "bg-gray-300 text-gray-700"
                }`}
                onClick={() => handleSortChange(option.order, option.field)}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UtilityBar;
