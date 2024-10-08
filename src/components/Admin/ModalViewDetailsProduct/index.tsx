import React, { useEffect, useState } from "react";
import Modal from "@/components/Fragments/Modal";
import { capitalizeFirst } from "@/utils/Capitalize";
import { signOut } from "next-auth/react";
import ConfirmButton from "@/components/Button/ConfirmButton";
import { deleteFile } from "@/lib/firebase/services";
import Image from "next/image";
import { formatPriceToIDR } from "@/utils/FormatPrice";

interface Product {
  _id: any;
  productImage: string;
  productName: string;
  price: string | number;
  category: any;
  stock: {
    variant: string;
    quantity: string;
  }[];
  productId: string;
  createdAt: string;
}

interface ModalViewDetailsProductProps {
  isViewDetailsProduct: Product;
  handleCloseModal: () => void;
  setProductsData: any;
  userInSession: any; // Menjadikan properti ini opsional
  setModalViewDetailsProduct: React.Dispatch<
    React.SetStateAction<string | null>
  >;
  accessToken?: string;
}

const ModalViewDetailsProduct: React.FC<ModalViewDetailsProductProps> = ({
  handleCloseModal,
  isViewDetailsProduct,
  setProductsData,
  setModalViewDetailsProduct,
  accessToken,
}) => {
  const [deletePermanentlyProduct, setDeletedPermanentlyUser] =
    useState<Product>(isViewDetailsProduct);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [activeTab, setActiveTab] = useState("generalInfo");

  const [selectedVariant, setSelectedVariant] = useState<string | null>(
    isViewDetailsProduct.stock.length > 0
      ? isViewDetailsProduct.stock[0].variant
      : null
  );

  const handleVariantClick = (variant: string) => {
    setSelectedVariant(variant); // Mengubah varian yang dipilih saat tombol diklik
  };

  const handleDeletePermanentlyProduct = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!accessToken) {
      setMessage("No access token provided.");
      setIsError(true);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/products`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ _id: isViewDetailsProduct._id }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setIsSuccess(true);
        setTimeout(() => {
          setProductsData((prevUsers: Product[]) =>
            prevUsers.filter(
              (item: Product) => item._id !== isViewDetailsProduct._id
            )
          );
        }, 1500);

        // Hapus file dari Firebase Storage
        await deleteFile(isViewDetailsProduct._id, "product");
      } else {
        setMessage(data.message);
        setIsError(true);
      }
    } catch (error) {
      if (error instanceof Error) {
        setMessage("Update Product Failed: " + error.message);
      } else {
        setMessage("Update Product Failed");
      }
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActiveTab = (tabName: string) => {
    setActiveTab(tabName);
  };
  // Delete Message
  useEffect(() => {
    if (isError || isSuccess) {
      const timer = setTimeout(() => {
        setIsError(false);
        setIsSuccess(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isError, isSuccess]);

  return (
    <Modal onClose={handleCloseModal}>
      <div className="w-[800px]">
        <div className="text-2xl mb-4 gap-2 text-black font-semibold">
          <h2>Product View</h2>
        </div>
        <div className="flex gap-2 pb-4 mb-4 text-sm text-gray-600 border-b-[1px]">
          <button
            onClick={() => handleActiveTab("generalInfo")}
            className={`p-2 border-2 rounded-md duration-300 ${
              activeTab === "generalInfo"
                ? "border-sky-500 text-sky-500"
                : "border-transparent"
            }`}
          >
            General Info
          </button>
          <button
            onClick={() => handleActiveTab("productDetails")}
            className={`p-2 border-2 rounded-md duration-300 ${
              activeTab === "productDetails"
                ? "border-sky-500 text-sky-500"
                : "border-transparent"
            }`}
          >
            Product Details
          </button>
        </div>
        <div className="flex gap-8">
          <div className="m-auto">
            <div className="w-96 h-96 flex items-center justify-center border-2 border-gray-300 p-2 rounded-md">
              {isViewDetailsProduct ? (
                <Image
                  src={isViewDetailsProduct.productImage}
                  width={400} // Width tetap
                  height={400} // Height tetap
                  alt={isViewDetailsProduct.productName || ""}
                  quality={100}
                  className="w-full h-full object-cover rounded-sm"
                  priority
                />
              ) : (
                <Image
                  src="/default.jpg"
                  width={400} // Width tetap
                  height={400} // Height tetap
                  alt="Default Image"
                  quality={100}
                  className="w-full h-full object-cover rounded-sm"
                />
              )}
            </div>
          </div>

          <div className="w-full">
            {activeTab === "generalInfo" && (
              <div className="rounded-md">
                <h3 className="text-white font-semibold text-xl text-center p-4 bg-sky-300 rounded-sm mb-4">
                  {isViewDetailsProduct.productName}
                </h3>
                <div className="flex items-center text-sm space-x-2 mb-2">
                  <p className="text-gray-600 font-medium">
                    Sold: <span className="text-black font-semibold">500+</span>
                  </p>
                  <span className="text-gray-400">|</span>
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
                <div className="price mb-2">
                  <p className="text-2xl font-semibold">
                    {formatPriceToIDR(isViewDetailsProduct.price)}
                  </p>
                </div>
                <div className="category text-sm mb-2">
                  <p>
                    <span className="text-gray-500">Category : </span>
                    {capitalizeFirst(isViewDetailsProduct.category)}
                  </p>
                </div>
                <div className="stock text-sm mb-4">
                  <p className="mb-2 text-center px-2 py-1 bg-sky-300 rounded-sm text-base">
                    <span className="text-white">Stock</span>
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {isViewDetailsProduct.stock.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleVariantClick(item.variant)}
                        className={`px-4 py-2 border rounded-md ${
                          selectedVariant === item.variant
                            ? "border-sky-500 text-sky-500"
                            : "border-gray-300 text-gray-600"
                        }`}
                      >
                        {item.variant}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Menampilkan quantity dari variant yang dipilih */}
                <div className="selected-variant text-sm mb-2">
                  {selectedVariant && (
                    <>
                      <p className="mb-2">
                        <span className="text-gray-500">
                          Selected Variant:{" "}
                        </span>
                        <span className="font-semibold text-black">
                          {selectedVariant}
                        </span>
                      </p>
                      <p>
                        <span className="text-gray-500">Quantity: </span>
                        <span className="font-semibold text-black">
                          {
                            isViewDetailsProduct.stock.find(
                              (item) => item.variant === selectedVariant
                            )?.quantity
                          }{" "}
                          pcs
                        </span>
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}

            {activeTab === "productDetails" && (
              <div>
                <h2 className="text-lg font-bold">Product Details</h2>
                <p>Here you can display specific product details.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalViewDetailsProduct;
