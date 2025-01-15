"use client";

import ProductsViews from "@/views/Products";
import Head from "next/head";
import React, { useEffect, useState } from "react";

const Products = () => {
  const [productsData, setProductsData] = useState<any[]>([]);
  const [dataPerPage, setDataPerPage] = useState(14);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(null);
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Fungsi untuk mengambil produk dari API atau cache
  const fetchProducts = async (page: number) => {
    const cachedData = localStorage.getItem(`products_page_${page}`);

    // if (cachedData) {
    //   const parsedData = JSON.parse(cachedData);
    //   setProductsData(parsedData.data);
    //   setTotalPages(parsedData.totalPages);
    //   setIsLoading(false);
    // } else {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/products?page=${page}&limit=${dataPerPage}&sort=${sortField}&order=${sortOrder}`,
        {
          next: { revalidate: 1 },
          mode: "cors",
          headers: {
            "Cache-Control": "no-cache",
            "Content-Type": "application/json",
          },
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch products. HTTP status: ${response.status}`
        );
      }

      const data = await response.json();
      setProductsData(data.data);
      setTotalPages(data.totalPages);
      setTotalProducts(data.total);

      localStorage.setItem(
        `products_page_${page}`,
        JSON.stringify({
          data: data.data,
          totalPages: data.totalPages,
        })
      );
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
    // }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage, dataPerPage, sortField, sortOrder]);

  const handleDataPerPage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDataPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  const handleSortChange = (field: string, order: string) => {
    setSortField(field);
    setSortOrder(order);
    setCurrentPage(1);
  };

  return (
    <>
      <Head>
        <title>Products</title>
      </Head>
      <ProductsViews
        productsData={productsData}
        totalProducts={totalProducts}
        isLoading={isLoading}
        handleDataPerPage={handleDataPerPage}
        dataPerPage={dataPerPage}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        handleSortChange={handleSortChange}
        sortField={sortField}
        sortOrder={sortOrder}
      />
    </>
  );
};

export default Products;
