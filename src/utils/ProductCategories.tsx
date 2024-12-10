export const ProductCategories = [
  { value: "gift", label: "Gift" },
  { value: "flower", label: "Flower" },
  { value: "suprize", label: "Suprize" },
  { value: "snack", label: "Snack" },
];

// utils/products.ts
export const isNewProduct = (createdAt: string, days: number = 7) => {
  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - days);
  return new Date(createdAt) >= daysAgo;
};
