"use client";

import ProductsViews from "@/views/Products";
import Head from "next/head";
import React, { useEffect } from "react";
const Products = () => {
  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const response = await fetch(`api/products`, {
          next: { revalidate: 1 },
          headers: {
            "Cache-Control": "no-cache",
            "Content-Type": "application/json",
          },
          method: "GET",
        });

        const data = await response.json();
        console.log(data);
      } catch (error) {}
    };
    getAllProducts();
  }, []);

  return (
    <>
      <Head>
        <title>Products</title>
      </Head>
      <ProductsViews />
    </>
  );
};

export default Products;
