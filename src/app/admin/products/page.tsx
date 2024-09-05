"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import ProductsManagementViews from "@/views/Admin/Products";
const ProductsManagement = () => {
  const [isLoading, setLoading] = useState(true);
  const { data: session } = useSession();
  const userInSession = session?.user;
  const accessToken = session?.accessToken;
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const currentUserRole = userInSession?.role;

  useEffect(() => {
    if (accessToken) {
      const getAllProducts = async () => {
        try {
          const response = await fetch(`/api/products`, {
            next: { revalidate: 1 },
            headers: {
              "Cache-Control": "no-cache",
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            method: "GET",
          });

          const data = await response.json();
          if (response.ok) {
            setProducts(data.data);
            setLoading(false);
          } else {
            setMessage(data.message);
          }
        } catch (error) {
          console.error("Failed to fetch products:", error);
        } finally {
          setLoading(false);
        }
      };
      getAllProducts();
    }
  }, [setLoading, accessToken]);

  return (
    <ProductsManagementViews
      products={products}
      isLoading={isLoading}
      userInSession={userInSession}
      accessToken={accessToken}
      message={message}
      currentUserRole={currentUserRole}
    />
  );
};

export default ProductsManagement;
