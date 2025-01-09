"use client";

import ProductCategoryViews from "@/views/Products/[Category]";
import React, { useEffect, useState } from "react";

interface ProductPageProps {
  params: { category: string };
}

const ProductCategoryPage: React.FC<ProductPageProps> = ({ params }) => {
  const { category } = params;
  const [productsDataByCategories, setProductsDataByCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getAllProductsByCategories = async () => {
      if (productsDataByCategories) {
        setLoading(true);
        try {
          const response = await fetch(`/api/products?category=${category}`);
          const data = await response.json();
          setProductsDataByCategories(data?.data || []);
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (category) {
      getAllProductsByCategories();
    }
  }, [category]);

  return (
    <ProductCategoryViews
      category={category}
      productsDataByCategories={productsDataByCategories}
    />
  );
};

export default ProductCategoryPage;
