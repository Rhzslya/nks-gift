"use client";

import React, { useState } from "react";
import { ProductCategories } from "@/utils/ProductCategories";
import { NavigationMenuProduct } from "@/components/NavLink";
import { usePathname } from "next/navigation";
import { isActiveLink } from "@/utils/ActiveLink";
import Image from "next/image";
import { capitalizeFirst } from "@/utils/Capitalize";
import { formatPriceToIDR } from "@/utils/FormatPrice";
import Link from "next/link";
import { productPageSortOptions } from "@/utils/SortOptions";

const ProductsViews = ({ productsData }: any) => {
  const path = usePathname();
  const [sortBy, setSortBy] = useState("sold");

  const sortProducts = (products: any[], sortBy: string) => {
    return [...products].sort((a, b) => {
      if (sortBy === "sold") {
        return b.sold - a.sold;
      } else if (sortBy === "price") {
        const priceA =
          typeof a.price === "string" ? parseFloat(a.price) : a.price;
        const priceB =
          typeof b.price === "string" ? parseFloat(b.price) : b.price;
        return priceB - priceA;
      }
      return 0;
    });
  };

  const sortedProducts = sortProducts(productsData, sortBy);
  console.log(sortedProducts);
  console.log(sortBy);
  return (
    <div className="max-w-[1400px] m-auto">
      <div className="flex justify-center px-6 bg-white">
        <NavigationMenuProduct
          items={[
            { value: "new-featured", label: "New & Featured" },
            ...ProductCategories,
          ]}
          path={path}
          basePath="/products"
          isActiveLink={isActiveLink}
        />
      </div>
      <div className="flex px-6 py-4 mx-8 justify-between text-sm border-b-[1px] border-gray-200">
        <div className="">
          <p>({productsData.length}) Items Found</p>
        </div>
        <div className="flex items-center">
          <p>Sort By :</p>
          <div className="relative ml-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none outline-none cursor-pointer bg-transparent border-none text-sm font-medium text-sky-300 pr-8 py-1" // perhatikan pr-8
            >
              {productPageSortOptions.map((option) => (
                <option key={option.label} value={option.field}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <i className="bx bx-chevron-down text-[20px]"></i>
            </span>
          </div>
        </div>
      </div>

      <div className="product-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 p-6">
        {sortedProducts.length > 0 ? (
          sortedProducts.map((product: any) => (
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

export default ProductsViews;
