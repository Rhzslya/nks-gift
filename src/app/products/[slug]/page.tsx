import ProductCategoryViews from "@/views/Products/[Slug]";
import React from "react";

interface ProductPageProps {
  params: { slug: string };
}

const ProductCategoryPage: React.FC<ProductPageProps> = ({ params }) => {
  const { slug } = params;

  return <ProductCategoryViews slug={slug} />;
};

export default ProductCategoryPage;
