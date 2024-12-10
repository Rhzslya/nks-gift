"use client";

import { capitalizeFirst } from "@/utils/Capitalize";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

interface ProductCategoryViewsProps {
  category: string;
  productsDataByCategories: any;
}

const ProductCategoryViews: React.FC<ProductCategoryViewsProps> = ({
  category,
  productsDataByCategories,
}) => {
  const path = usePathname();
  const productCategory = category.replace(/-/, " ");

  const generateBreadcrumbs = () => {
    const segments = path.split("/").filter(Boolean);
    return segments.map((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");
      const label = capitalizeFirst(segment.replace(/-/, " "));
      return { href, label };
    });
  };
  const breadcrumbs = generateBreadcrumbs();

  return (
    <div>
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
      <div className="mt-4 text-center">
        <h1 className="text-2xl font-bold capitalize">{productCategory}</h1>
        <p className="mt-2">
          This is the page for the product: {productCategory}
        </p>
        <div className="">
          {productsDataByCategories.length > 0 ? (
            <ul>
              {productsDataByCategories.map((product: any) => (
                <li key={product._id}>{product.productName}</li>
              ))}
            </ul>
          ) : (
            <p>No products found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCategoryViews;