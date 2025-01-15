"use client";

import React, { useState } from "react";
import { ProductCategories } from "@/utils/ProductCategories";
import { NavigationMenuProduct } from "@/components/NavLink";
import { usePathname, useRouter } from "next/navigation"; // Import useRouter
import { isActiveLink } from "@/utils/ActiveLink";
import Image from "next/image";
import { capitalizeFirst } from "@/utils/Capitalize";
import { formatPriceToIDR } from "@/utils/FormatPrice";
import Link from "next/link";
import { productPageSortOptions } from "@/utils/SortOptions";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import CardSkeleton from "@/utils/Skeleton";
import PaginationToolbar from "@/components/Admin/PaginationToolbar";

const ProductsViews = ({
  productsData,
  totalProducts,
  isLoading,
  handleDataPerPage,
  dataPerPage,
  currentPage,
  totalPages,
  setCurrentPage,
  handleSortChange,
  sortField,
  sortOrder,
}: any) => {
  const path = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = productsData.filter((product: any) =>
    product.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      router.push(`products/search?q=${searchQuery}`);
    }
  };

  const generateBreadcrumbs = () => {
    const segments = path.split("/").filter(Boolean);
    return segments.map((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");
      const label = capitalizeFirst(segment);
      return { href, label };
    });
  };
  const breadcrumbs = generateBreadcrumbs();

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
      <div className="breadcrumbs w-full">
        <nav className="flex px-6 py-2 text-sm text-gray-500 space-x-2">
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
      <div className="flex py-2 px-6 text-sm text-gray-500 border-b-[1px] border-gray-200 ">
        <div className="flex items-center">
          <p>Sort By :</p>
          <div className="relative ml-2">
            <select
              value={`${sortField}_${sortOrder}`} // Gabungkan field dan order
              onChange={(e) => {
                const [field, order] = e.target.value.split("_");
                handleSortChange(field, order); // Ubah sesuai opsi
              }}
            >
              <option value="price_desc">Highest Price</option>
              <option value="price_asc">Lowest Price</option>
              <option value="createdAt_desc">Newest Products</option>
              <option value="createdAt_asc">Oldest Products</option>
              <option value="productName_asc">A-Z (Product Name)</option>
              <option value="productName_desc">Z-A (Product Name)</option>
            </select>

            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"></span>
          </div>
        </div>
      </div>

      <div className="flex justify-between py-2 px-6 text-sm text-gray-500">
        <div className="">
          <p>({totalProducts}) Items Found</p>
        </div>
        <div className="relative w-full max-w-xs flex">
          <span className="absolute inset-y-0 left-0 top-0 flex items-center pl-3 pr-2 border-r-[1px] border-gray-300">
            <i className="bx bx-search text-[20px] text-gray-600"></i>
          </span>
          <input
            type="text"
            placeholder="Search Product"
            className="w-full px-2 py-1 border rounded-full text-sm pl-12 focus:border-sky-300 focus:outline-none"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
          />
          {searchQuery && (
            <div className="absolute w-full top-6 py-2 z-10">
              {filteredProducts.length > 0 ? (
                <ul
                  className={`bg-white border shadow-lg divide-y ${
                    filteredProducts.length <= 5 ? "rounded-lg" : "rounded-t-lg"
                  }`}
                >
                  {filteredProducts.slice(0, 5).map((product: any) => (
                    <li key={product._id} className="block hover:bg-gray-100">
                      <Link
                        href={`products/${product.category[0]}/${product.productId}`}
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
              {filteredProducts.length > 5 && (
                <button
                  onClick={() =>
                    router.push(`/products/search?q=${searchQuery}`)
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

      <div className="product-list grid grid-cols-[repeat(auto-fit,_minmax(auto,_180px))] gap-4 p-4">
        {isLoading ? (
          <CardSkeleton cards={16} />
        ) : (
          productsData.map((product: any) => (
            <Link
              href={`products/${product.category[0]}/${product.productId}`}
              key={product._id}
              className="product-item flex flex-col border p-2 rounded-lg shadow-lg"
            >
              <div className="relative w-full mb-4 flex justify-center">
                <Image
                  src={product.productImage}
                  alt={product.productName}
                  className="object-cover rounded-sm "
                  quality={100}
                  width={160}
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
        )}
      </div>
      <PaginationToolbar
        usersPerPage={dataPerPage}
        handleUsersPerPage={handleDataPerPage}
        items={totalProducts}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        rowsPerPageOptions={[dataPerPage]}
      />
    </div>
  );
};

export default ProductsViews;
