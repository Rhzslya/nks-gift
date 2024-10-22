import React from "react";

interface SearchQueryProps {
  searchPlaceholder: string;
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchQuery: React.FC<SearchQueryProps> = ({
  searchPlaceholder,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="relative pr-10 border-r-2 border-gray-300">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
        <i className="bx bx-search text-[20px] text-gray-600"></i>
      </span>
      <input
        type="text"
        placeholder={searchPlaceholder}
        className="px-2 py-1 border rounded text-sm pl-10 focus:border-sky-300 focus:outline-none"
        value={searchQuery}
        onChange={onSearchChange}
      />
    </div>
  );
};

export default SearchQuery;
