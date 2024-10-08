import React, { useEffect, useState } from "react";
import Modal from "@/components/Fragments/Modal";
import { capitalizeFirst } from "@/utils/Capitalize";
import { signOut } from "next-auth/react";
import ConfirmButton from "@/components/Button/ConfirmButton";
import { deleteFile } from "@/lib/firebase/services";

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
}

interface ModalDeletePermanentlyUserProps {
  isDeletedPermanentlyProduct: Product;
  handleCloseModal: () => void;
  setProductsData: any;
  userInSession: any; // Menjadikan properti ini opsional
  setModalDeletePermanentlyProduct: React.Dispatch<
    React.SetStateAction<string | null>
  >;
  accessToken?: string;
}

const ModalDeletePermanently: React.FC<ModalDeletePermanentlyUserProps> = ({
  handleCloseModal,
  isDeletedPermanentlyProduct,
  setProductsData,
  setModalDeletePermanentlyProduct,
  accessToken,
}) => {
  const [deletePermanentlyProduct, setDeletedPermanentlyUser] =
    useState<Product>(isDeletedPermanentlyProduct);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

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
        body: JSON.stringify({ _id: isDeletedPermanentlyProduct._id }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setIsSuccess(true);
        setTimeout(() => {
          setProductsData((prevUsers: Product[]) =>
            prevUsers.filter(
              (item: Product) => item._id !== isDeletedPermanentlyProduct._id
            )
          );
        }, 1500);

        // Hapus file dari Firebase Storage
        await deleteFile(isDeletedPermanentlyProduct._id, "product");
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
      <div className="w-[400px]">
        <div className="text-xl text-center mb-4 flex justify-center items-center gap-2 text-red-500">
          <i className="bx bx-error-circle text-[24px] text-red-500"></i>
          <h4>Product Deletion Confirmation</h4>
        </div>

        <div className="flex flex-col">
          <div className="text-sm mb-4 text-gray-600 border-b-[1px] border-gray-500 py-1">
            <p>
              Are you sure you want to permanently delete all{" "}
              <span className="font-medium">
                records, history, and associated orders
              </span>{" "}
              related to{" "}
              <span className="font-medium">
                {capitalizeFirst(deletePermanentlyProduct?.productName)}
              </span>{" "}
              from the company{"'"}s system?{" "}
              <span className="text-red-500">
                This action is irreversible, and all data will be permanently
                removed.
              </span>
            </p>
          </div>

          <div className="flex mb-4 gap-2">
            <ConfirmButton
              text="Yes, Delete"
              onClick={handleDeletePermanentlyProduct}
              variant="confirm"
            />
            <ConfirmButton
              text="No, Cancel"
              onClick={() => setModalDeletePermanentlyProduct(null)}
              variant="cancel"
            />
          </div>
          {isSuccess && (
            <div className="flex items-center gap-2 text-green-500">
              <i className="bx bx-check-circle text-[24px]"></i>
              <p>{message}</p>
            </div>
          )}
          {isError && (
            <div className="flex items-center gap-2 text-red-500">
              <i className="bx bx-x-circle text-[24px]"></i>
              <p>{message}</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ModalDeletePermanently;
