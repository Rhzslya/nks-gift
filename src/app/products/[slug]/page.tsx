import ProductCategoryViews from "@/views/Products/[Slug]";
import React from "react";

interface ProductPageProps {
  params: { slug: string };
}

const ProductCategoryPage: React.FC<ProductPageProps> = ({ params }) => {
  const { slug } = params;
  const title = slug;

  return <ProductCategoryViews title={title} />;
};

export default ProductCategoryPage;
