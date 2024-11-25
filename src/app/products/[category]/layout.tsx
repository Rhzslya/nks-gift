"use client";
// app/products/layout.tsx
import React from "react";
import { NavigationMenuProduct } from "@/components/NavLink";
import { ProductCategories } from "@/utils/ProductCategories";
import { usePathname } from "next/navigation";
import { isActiveLink } from "@/utils/ActiveLink";

const ProductCategoryLayouts = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const path = usePathname();

  return (
    <div>
      {/* Menu navigasi yang sama */}
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
      <div>{children}</div>
    </div>
  );
};

export default ProductCategoryLayouts;
