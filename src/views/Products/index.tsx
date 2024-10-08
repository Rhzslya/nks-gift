"use client";
import React from "react";
import { ProductCategories } from "@/utils/ProductCategories"; // Import dari file yang baru
import { NavigationMenuProduct } from "@/components/NavLink";
import { usePathname } from "next/navigation";
import { isActiveLink } from "@/utils/ActiveLink";
const ProductsViews = () => {
  const path = usePathname();
  console.log(path);
  return (
    <div>
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
    </div>
  );
};

export default ProductsViews;
