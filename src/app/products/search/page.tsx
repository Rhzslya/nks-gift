"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { NavigationMenuProduct } from "@/components/NavLink";
import { ProductCategories } from "@/utils/ProductCategories";
import { isActiveLink } from "@/utils/ActiveLink";
import Link from "next/link";
import Image from "next/image";
import { capitalizeFirst } from "@/utils/Capitalize";
import { formatPriceToIDR } from "@/utils/FormatPrice";
import SearchViews from "@/views/Products/Search";
const Search = () => {
  const searchParams = useSearchParams(); // Mengambil search params dari URL
  const query = searchParams.get("q"); // Mengambil nilai dari query parameter 'q'
  const path = usePathname();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      // Panggil API untuk mendapatkan produk yang cocok dengan query
      const fetchProducts = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/products?q=${query}`);
          const data = await response.json();
          if (data.status) {
            setProducts(data.data);
          }
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchProducts();
    }
  }, [query]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <SearchViews path={path} />;
};

export default Search;
