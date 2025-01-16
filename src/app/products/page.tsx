"use client";

import ProductsViews from "@/views/Products";
import Head from "next/head";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Products = () => {
  const router = useRouter();
  const [productsData, setProductsData] = useState<any[]>([]);
  const [dataPerPage, setDataPerPage] = useState(14);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(null);
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

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

  function debounce(func: (...args: any[]) => void, delay: number) {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  }

  const handleSearchChange = React.useCallback(
    debounce(async (query: string) => {
      if (query.trim() !== "") {
        try {
          const response = await fetch(`/api/products/search?q=${query}`, {
            method: "GET",
          });
          const data = await response.json();

          if (data.status && data.data) {
            const filtered = data.data.filter((product: any) =>
              product.productName.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredProducts(filtered);
          } else {
            setFilteredProducts([]);
          }
        } catch (error) {
          console.error("Error fetching search results:", error);
          setFilteredProducts([]);
        }
      } else {
        setFilteredProducts([]);
      }
    }, 500),
    []
  );

  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    handleSearchChange(e.target.value);
  };

  const handleSearchNavigation = React.useCallback(() => {
    const currentParams = new URLSearchParams(window.location.search);
    const currentQuery = currentParams.get("q");

    if (searchQuery.trim() !== "" && currentQuery !== searchQuery) {
      router.push(`/products/search?q=${searchQuery}`);
    }
  }, [router, searchQuery]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchNavigation();
    }
  };

  const handleMoreResult = () => {
    handleSearchNavigation();
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
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
        filteredProducts={filteredProducts}
        onSearchInputChange={onSearchInputChange}
        handleKeyDown={handleKeyDown}
        handleMoreResult={handleMoreResult}
      />
    </>
  );
};

export default Products;
