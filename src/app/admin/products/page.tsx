"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import ProductsManagementViews from "@/views/Admin/Products";
const ProductsManagement = () => {
  const [isLoading, setLoading] = useState(false);
  const { data: session } = useSession();
  const userInSession = session?.user;
  const accessToken = session?.accessToken;

  return (
    <ProductsManagementViews
      isLoading={isLoading}
      userInSession={userInSession}
      accessToken={accessToken}
    />
  );
};

export default ProductsManagement;
