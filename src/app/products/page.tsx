"use client";

import ProductsViews from "@/views/Products";
import Head from "next/head";
import React, { useEffect, useState } from "react";

const Products = () => {
  const [productsData, setProductsData] = useState([]);

  useEffect(() => {
    const getAllProducts = async () => {
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

        const data = await response.json();
        setProductsData(data.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    getAllProducts();
  }, []);

  return (
    <>
      <Head>
        <title>Products</title>
      </Head>
      <ProductsViews productsData={productsData} />
    </>
  );
};

export default Products;
