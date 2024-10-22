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
const SearchViews = () => {
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

  return (
    <div>
      <NavigationMenuProduct
        items={[
          { value: "new-featured", label: "New & Featured" },
          ...ProductCategories,
        ]}
        path={path}
        basePath="/products"
        isActiveLink={isActiveLink}
      />
      <h1>{`Search Results for "${query}"`}</h1>
      <div className="product-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 p-6">
        {products.length > 0 ? (
          products.map((product: any) => (
            <Link
              href={`products/${product.category}/${product.productId}`}
              key={product._id}
              className="product-item flex flex-col border p-4 rounded-lg shadow-lg"
            >
              <div className="relative w-full h-64 mb-4">
                <Image
                  src={product.productImage}
                  alt={product.productName}
                  className="object-cover rounded-sm w-full h-full"
                  quality={100}
                  width={300}
                  height={300}
                  priority
                />
              </div>
              <h3 className="text-xl font-bold mb-2 truncate">
                {product.productName}
              </h3>
              <div className="flex justify-between pb-2 border-b-[1px] border-gray-400">
                <p className="text-gray-600 mb-1">
                  {capitalizeFirst(product.category)}
                </p>
                <p className="text-gray-800 font-semibold">
                  {formatPriceToIDR(product.price)}
                </p>
              </div>
              <div className="flex items-center justify-between text-sm space-x-2 mb-2 pt-2">
                <p className="text-gray-600 font-medium">
                  Sold: <span className="text-black font-semibold">500+</span>
                </p>
                <div className="flex items-center">
                  <svg
                    className="unf-icon"
                    viewBox="0 0 24 24"
                    width="14"
                    height="14"
                    fill="#FFD700"
                    style={{
                      display: "inline-block",
                      marginRight: "4px",
                      verticalAlign: "middle",
                    }}
                  >
                    <path d="M12 .587l3.668 7.431 8.215 1.176-5.941 5.782 1.404 8.181L12 18.899l-7.346 3.86 1.404-8.181-5.941-5.782 8.215-1.176z"></path>
                  </svg>
                  <span className="text-black font-semibold">3.9</span>
                  <span className="text-gray-500 ml-1">(47 Reviews)</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
    </div>
  );
};

export default SearchViews;
