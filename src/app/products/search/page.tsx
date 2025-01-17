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

// Define a type for Product
interface Product {
  _id: string;
  productId: string;
  productName: string;
  productImage: string;
  category: string;
  price: number;
}

import SearchViews from "@/views/Products/Search";
const Search = () => {
  const searchParams = useSearchParams(); // Mengambil search params dari URL
  const query = searchParams.get("q"); // Mengambil nilai dari query parameter 'q'
  const path = usePathname();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  console.log(path);

  useEffect(() => {
    if (query) {
      console.log(query);
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

  return <SearchViews path={path} products={products} loading={loading} />;
};

export default Search;
