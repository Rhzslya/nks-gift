// utils/formatUtils.ts
export const formatPriceToIDR = (price: number | string): string => {
  // Convert string to number if necessary
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  // Handle non-numeric values gracefully
  if (isNaN(numericPrice)) return "";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericPrice);
};
