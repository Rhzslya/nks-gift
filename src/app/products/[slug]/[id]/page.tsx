import ProductCategoryViews from "@/views/Products/[Slug]";
import React from "react";

interface ProductDetailProps {
  params: { id: string };
}

const ProductDetail: React.FC<ProductDetailProps> = ({ params }) => {
  const { id } = params;
  const title = id;
  console.log(title);

  return <ProductCategoryViews title={title} />;
};

export default ProductDetail;
