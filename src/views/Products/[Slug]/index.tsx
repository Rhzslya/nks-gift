import React from "react";

interface ProductCategoryViewsProps {
  title: string; // Tipe 'string' untuk prop title
}

const ProductCategoryViews: React.FC<ProductCategoryViewsProps> = ({
  title,
}) => {
  return (
    <div>
      <div className="mt-4 text-center">
        <h1 className="text-2xl font-bold capitalize">{title}</h1>
        <p className="mt-2">This is the page for the product: {title}</p>
      </div>
    </div>
  );
};

export default ProductCategoryViews;
