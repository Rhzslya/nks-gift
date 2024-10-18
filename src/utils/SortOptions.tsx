export interface SortOption {
  label: string;
  field: string;
  order: "asc" | "desc";
}

export const userSortOptions: SortOption[] = [
  { label: "Sort by Username (A-Z)", field: "username", order: "asc" },
  { label: "Sort by Username (Z-A)", field: "username", order: "desc" },
  {
    label: "Sort by Created Date (Oldest First)",
    field: "createdAt",
    order: "asc",
  },
  {
    label: "Sort by Created Date (Newest First)",
    field: "createdAt",
    order: "desc",
  },
  {
    label: "Sort by Access Level (Higher First)",
    field: "accessLevel",
    order: "asc",
  },
  {
    label: "Sort by Access Level (Lower First)",
    field: "accessLevel",
    order: "desc",
  },
];

export const productSortOptions: SortOption[] = [
  { label: "Sort by Product Name (A-Z)", field: "productName", order: "asc" },
  { label: "Sort by Product Name (Z-A)", field: "productName", order: "desc" },
  { label: "Sort by Price (Low to High)", field: "price", order: "asc" },
  { label: "Sort by Price (High to Low)", field: "price", order: "desc" },
  {
    label: "Sort by Date Created (Oldest First)",
    field: "createdAt",
    order: "asc",
  },
  {
    label: "Sort by Date Created (Newest First)",
    field: "createdAt",
    order: "desc",
  },
];

export const productPageSortOptions = [
  { label: "Popular", field: "sold" },
  { label: "Price", field: "price" },
];
