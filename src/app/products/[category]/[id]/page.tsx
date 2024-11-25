import ProductDetailViews from "@/views/Products/[Category]/[Id]";
import React from "react";

interface ProductDetailProps {
  params: { id: string };
}

const ProductCategoryPage: React.FC<ProductDetailProps> = ({ params }) => {
  const { id } = params;

  console.log(id);
  return <ProductDetailViews id={id} />;
};

export default ProductCategoryPage;
