"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, usePathname } from "next/navigation";
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

interface SearchViewsProps {
  path: string;
}

const SearchViews: React.FC<SearchViewsProps> = ({ path }) => {
  const searchParams = useSearchParams(); // Get search params from URL
  const query = searchParams.get("q"); // Get the value from the 'q' query parameter
  const [products, setProducts] = useState<Product[]>([]); // State for products
  const [loading, setLoading] = useState<boolean>(true); // State for loading status

  useEffect(() => {
    if (query) {
      // Fetch products that match the query
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

  const generateBreadcrumbs = () => {
    const segments = path.split("/").filter(Boolean);
    return segments.map((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");
      const label = capitalizeFirst(segment);
      return { href, label };
    });
  };

  const breadcrumbs = generateBreadcrumbs();
  console.log(breadcrumbs);

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
      <div className="breadcrumbs w-full px-6">
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
      <div className="px-6 text-gray-500 text-sm">
        <h1>{`Search Results for "${query}"`}</h1>
      </div>
      <div className="product-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 p-6">
        {products.length > 0 ? (
          products.map((product) => (
            <Link
              href={`${product.category}/${product.productId}`}
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
                  {capitalizeFirst(product.category[0])}
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
