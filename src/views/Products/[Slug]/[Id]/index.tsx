import React from "react";

interface ProductDetailViewsProps {
  title: string; // Tipe 'string' untuk prop title
}

const ProductDetailViews: React.FC<ProductDetailViewsProps> = ({ title }) => {
  return (
    <div>
      <div className="mt-4 text-center">
        <h1 className="text-2xl font-bold capitalize">{title}</h1>
        <p className="mt-2">This is the page for the product: {title}</p>
      </div>
    </div>
  );
};

export default ProductDetailViews;
