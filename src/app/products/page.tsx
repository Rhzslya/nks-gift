"use client";

import ProductsViews from "@/views/Products";
import Head from "next/head";
import React, { useEffect, useState } from "react";

const Products = () => {
  const [productsData, setProductsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getAllProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`api/products`, {
          next: { revalidate: 1 },
          mode: "cors",
          headers: {
            "Cache-Control": "no-cache",
            "Content-Type": "application/json",
          },
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch products. HTTP status: ${response.status}`
          );
        }

        const data = await response.json();
        setProductsData(data.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getAllProducts();
  }, []);

  return (
    <>
      <Head>
        <title>Products</title>
      </Head>
      <ProductsViews productsData={productsData} isLoading={isLoading} />
    </>
  );
};

export default Products;
