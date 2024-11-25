import ProductCategoryViews from "@/views/Products/[Category]";
import React from "react";

interface ProductPageProps {
  params: { category: string };
}

const ProductCategoryPage: React.FC<ProductPageProps> = ({ params }) => {
  const { category } = params;

  return <ProductCategoryViews category={category} />;
};

export default ProductCategoryPage;
