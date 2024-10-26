"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const SearchViews = () => {
  const searchParams = useSearchParams(); // Mengambil search params dari URL
  const query = searchParams.get("q"); // Mengambil nilai dari query parameter 'q'

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      // Panggil API untuk mendapatkan produk yang cocok dengan query
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

  return (
    <div>
      <h1>Search Results for {query}</h1>
      {products.length > 0 ? (
        <ul>
          {products.map((product: any) => (
            <li key={product._id}>{product.productName}</li>
          ))}
        </ul>
      ) : (
        <p>No products found</p>
      )}
    </div>
  );
};

export default SearchViews;
