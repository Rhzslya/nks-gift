"use client";

import { capitalizeFirst } from "@/utils/Capitalize";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

interface ProductDetailViewsProps {
  id: string; // Tipe 'string' untuk prop id
}

interface Product {
  productId: string;
  productName: string;
  productImage: string;
  category: string;
  price: number;
  stock: any[];
  createdAt: string;
  updatedAt: string;
}

const ProductDetailViews: React.FC<ProductDetailViewsProps> = ({ id }) => {
  const path = usePathname();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      if (id) {
        setLoading(true);
        try {
          const response = await fetch(`/api/products?id=${id}`);
          const data = await response.json();
          setProduct(data?.data[0] || null);
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProductsByCategory();
  }, [id]);

  const generateBreadcrumbs = () =>
    path
      .split("/")
      .filter(Boolean)
      .map((segment, index, segments) => ({
        href: "/" + segments.slice(0, index + 1).join("/"),
        label: capitalizeFirst(segment.replace(/-/g, " ")),
      }));

  const breadcrumbs = generateBreadcrumbs();
  console.log(product);
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
    </div>
  );
};

export default ProductDetailViews;
