"use client";

import { capitalizeFirst } from "@/utils/Capitalize";
import { formatPriceToIDR } from "@/utils/FormatPrice";
import { productPageSortOptions } from "@/utils/SortOptions";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState, useMemo } from "react";
import Skeleton from "react-loading-skeleton";

interface ProductCategoryViewsProps {
  category: string;
  productsDataByCategories: any;
}

const ProductCategoryViews: React.FC<ProductCategoryViewsProps> = ({
  category,
  productsDataByCategories,
}) => {
  const path = usePathname();
  const router = useRouter(); // Inisialisasi router
  const productCategory = category.replace(/-/, " ");
  const [activeSortOption, setActiveSortOption] = useState("sold");
  const [searchKeyword, setSearchKeyword] = useState("");

  const getSortedProducts = (products: any[], sortOption: string) => {
    return [...products].sort((a, b) => {
      if (sortOption === "sold") {
        return b.sold - a.sold;
      } else if (sortOption === "price") {
        const priceA =
          typeof a.price === "string" ? parseFloat(a.price) : a.price;
        const priceB =
          typeof b.price === "string" ? parseFloat(b.price) : b.price;
        return priceB - priceA;
      }
      return 0;
    });
  };

  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  const onSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      router.push(`/products/search?q=${searchKeyword}`);
    }
  };

  const filteredProductsByKeyword = productsDataByCategories.filter(
    (product: any) =>
      product.productName.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const generateBreadcrumbs = () => {
    const segments = path.split("/").filter(Boolean);
    return segments.map((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");
      const label = capitalizeFirst(segment.replace(/-/, " "));
      return { href, label };
    });
  };
  const breadcrumbs = generateBreadcrumbs();

  const sortedAndFilteredProducts = getSortedProducts(
    filteredProductsByKeyword,
    activeSortOption
  );

  return (
    <div className="max-w-[1400px] m-auto flex flex-col main-w-header">
      <div className="breadcrumbs w-full">
        <nav className="flex py-2 text-sm text-gray-500 space-x-2">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          {breadcrumbs.map((breadcrumb, index) => (
            <React.Fragment key={index}>
              <span>&gt;</span>
              {breadcrumb.href === path ? (
                <span className="text-sky-300">{breadcrumb.label}</span>
              ) : (
                <Link href={breadcrumb.href} className="hover:underline">
                  {breadcrumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>
      <div className="flex py-4 px-6  text-sm text-gray-500 border-b-[1px] border-gray-200 ">
        <div className="flex items-center">
          <p>Sort By :</p>
          <div className="relative ml-2">
            <select
              value={activeSortOption}
              onChange={(e) => setActiveSortOption(e.target.value)}
              className="appearance-none outline-none cursor-pointer bg-transparent border-none text-sm font-medium text-sky-300 pr-8 py-1"
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

      <div className="flex justify-between pt-4 py-1 px-6 text-sm text-gray-500">
        <div className="">
          <p>({productsDataByCategories.length}) Items Found</p>
        </div>
        <div className="relative w-full max-w-xs flex">
          <span className="absolute inset-y-0 left-0 top-0 flex items-center pl-3 pr-2 border-r-[1px] border-gray-300">
            <i className="bx bx-search text-[20px] text-gray-600"></i>
          </span>
          <input
            type="text"
            placeholder="Search Product"
            className="w-full px-2 py-1 border rounded-full text-sm pl-12 focus:border-sky-300 focus:outline-none"
            value={searchKeyword}
            onChange={onSearchInputChange}
            onKeyDown={onSearchKeyPress}
          />
          {searchKeyword && (
            <div className="absolute w-full top-6 py-2 z-10">
              {filteredProductsByKeyword.length > 0 ? (
                <ul
                  className={`bg-white border shadow-lg divide-y ${
                    filteredProductsByKeyword.length <= 5
                      ? "rounded-lg"
                      : "rounded-t-lg"
                  }`}
                >
                  {filteredProductsByKeyword.slice(0, 5).map((product: any) => (
                    <li key={product._id} className="block hover:bg-gray-100">
                      <Link
                        href={`/products/${product.category[0]}/${product.productId}`}
                        className="block p-2"
                      >
                        {product.productName}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="bg-white border rounded-lg shadow-lg divide-y p-2">
                  No products found.
                </p>
              )}
              {filteredProductsByKeyword.length > 5 && (
                <button
                  onClick={() =>
                    router.push(`/products/search?q=${searchKeyword}`)
                  }
                  className="block w-full text-center py-2 bg-white border-b border-x hover:bg-gray-200 rounded-b-lg"
                >
                  View More Results
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="product-list grid grid-cols-[repeat(auto-fit,_minmax(auto,_150px))] gap-4 p-4">
        {sortedAndFilteredProducts.length > 0 ? (
          sortedAndFilteredProducts.map((product: any) => (
            <Link
              href={`${product.category[0]}/${product.productId}`}
              key={product._id}
              className="product-item flex flex-col border p-2 rounded-lg shadow-lg"
            >
              <div className="relative w-full mb-4">
                <Image
                  src={product.productImage}
                  alt={product.productName}
                  className="object-cover rounded-sm"
                  quality={100}
                  width={150}
                  height={200}
                  priority
                />
              </div>
              <h3 className="text-base font-medium truncate">
                {product.productName}
              </h3>
              <div className="flex justify-between pb-2 border-b-[1px] border-gray-400 text-xs">
                <p className="text-gray-600 mb-1">
                  {capitalizeFirst(product.category[0])}
                </p>
                <p className="text-gray-800 font-semibold">
                  {formatPriceToIDR(product.price)}
                </p>
              </div>
              <div className="flex items-center justify-between  text-xs space-x-2 mb-2 pt-2">
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
                </div>
              </div>
            </Link>
          ))
        ) : (
          <Skeleton />
        )}
      </div>
    </div>
  );
};

export default ProductCategoryViews;
