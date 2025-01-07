import React, { RefObject } from "react";
import { SortOption } from "@/utils/SortOptions";
import SearchQuery from "@/components/SearchQuery/inde";

interface UtilityBarProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleFilter: () => void;
  filterToggleButtonRef: RefObject<HTMLButtonElement>;
  isFilterMenuOpen: boolean;
  filterMenuRef: RefObject<HTMLDivElement>;
  isSortOptionActive: (order: "asc" | "desc", field: any) => boolean;
  onSortOptionChange: (order: "asc" | "desc", field: any) => void;
  searchPlaceholder: string;
  sortingOptions: SortOption[];
  showAddDataButton?: boolean;
  textAddData?: string;
  onAddData?: any;
  modalShowAddData?: boolean;
  modalAddData?: any;
}

const UtilityBar: React.FC<UtilityBarProps> = ({
  searchQuery,
  onSearchChange,
  onToggleFilter,
  filterToggleButtonRef,
  isFilterMenuOpen,
  filterMenuRef,
  isSortOptionActive,
  onSortOptionChange,
  searchPlaceholder,
  sortingOptions,
  showAddDataButton,
  textAddData,
  onAddData,
  modalShowAddData,
  modalAddData,
}) => {
  return (
    <div className="py-2 flex items-center">
      <SearchQuery
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        searchPlaceholder={searchPlaceholder}
      />
      <div className="pl-10">
        <button onClick={onToggleFilter} ref={filterToggleButtonRef}>
          <i
            className={`bx bx-filter text-[28px] text-gray-500 cursor-pointer rounded-md hover:bg-gray-200 duration-300 ${
              isFilterMenuOpen && "bg-gray-200"
            }`}
          ></i>
        </button>

        {isFilterMenuOpen && (
          <div
            ref={filterMenuRef}
            className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50"
          >
            {sortingOptions.map((option) => (
              <button
                key={`${option.field}-${option.order}`}
                className={`block px-4 py-2 text-xs text-gray-500 hover:bg-gray-100 w-full text-left ${
                  isSortOptionActive(option.order, option.field) &&
                  "bg-gray-300 text-gray-700"
                }`}
                onClick={() => onSortOptionChange(option.order, option.field)}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {showAddDataButton && (
        <div className="ml-auto text-white">
          <button
            onClick={onAddData}
            className="px-2 py-1 bg-sky-300 text-sm hover:bg-sky-200 duration-300"
          >
            {textAddData}
          </button>
          {modalShowAddData && modalAddData}
        </div>
      )}
    </div>
  );
};

export default UtilityBar;
