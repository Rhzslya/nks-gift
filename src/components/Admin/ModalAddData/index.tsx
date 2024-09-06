import React, { useEffect, useState } from "react";
import Modal from "@/components/fragements/Modal";
import LabelAndInput from "@/components/Form/Label";
import Select from "@/components/Select";
import SubmitButton from "@/components/Button/SubmitButton";
import { capitalizeFirst } from "@/utils/Capitalize";
import MessageFromAPI from "@/components/Form/MessageFromAPI";
import { useRouter } from "next/navigation";
import {
  handleChange,
  handlePriceChange,
  handleSelectChange,
} from "@/utils/handleChange";
import { validationAddProduct } from "@/utils/Validations";
interface Product {
  productName: string;
  category: string;
  stock: {
    variant: string;
    quantity: string;
  }[];
  price: string;
}

interface ModalUpdatedUserProps {
  handleCloseModal: () => void;
  accessToken: any;
  onProductAdded: any;
  setShowModalAddData: any;
}

const ModalAddData: React.FC<ModalUpdatedUserProps> = ({
  handleCloseModal,
  accessToken,
  onProductAdded,
  setShowModalAddData,
}) => {
  const [product, setProduct] = useState({
    productName: "",
    category: "",
    stock: [
      {
        variant: "", // Ubah jadi string untuk input sementara
        quantity: "", // Ubah jadi string untuk input sementara
      },
    ], // Ubah jadi array of objects untuk mendukung duplikasi
    price: "",
  });

  const [rawPrice, setRawPrice] = useState("");
  const [errors, setErrors] = useState<Record<string, any>>({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const filteredOptions = [
    { value: "", label: "Select Category" },
    { value: "gift", label: "Gift" },
    { value: "flower", label: "Flower" },
    { value: "suprize", label: "Suprize" },
    { value: "snack", label: "Snack" },
  ];

  const handleAddStockField = () => {
    // Cek apakah semua stock item sudah memiliki nilai untuk variant dan quantity
    const allFieldsFilled = product.stock.every(
      (stockItem) => stockItem.variant !== "" && stockItem.quantity !== ""
    );

    if (allFieldsFilled) {
      setProduct((prev) => ({
        ...prev,
        stock: [
          ...prev.stock,
          { variant: "", quantity: "" }, // Menambahkan input baru untuk stock
        ],
      }));
    } else {
      // Tambahkan pesan error atau alert jika ada field yang belum diisi
      alert("Please fill in all existing fields before adding more.");
    }
  };

  const handleStockChange = (
    index: number,
    field: keyof (typeof product)["stock"][number],
    value: string
  ) => {
    const newStock = [...product.stock];
    newStock[index][field] = value;
    setProduct((prev) => ({
      ...prev,
      stock: newStock,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validationAddProduct(product);
    setIsLoading(true);
    setErrors(validationErrors);
    const products = {
      ...product,
      price: rawPrice, // Use raw price for actual data submission
    };
    try {
      if (Object.keys(validationErrors).length === 0) {
        const response = await fetch("/api/products", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          method: "POST",
          body: JSON.stringify({ products }),
        });

        const data = await response.json();
        console.log(data);
        if (response.ok) {
          onProductAdded(data.data);
          setShowModalAddData(false);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error instanceof Error) {
          console.log(error);
        }
      } else {
        setMessage("Signup failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal onClose={handleCloseModal}>
      <div className="w-[500px]  overflow-y-auto max-h-[550px] text-black">
        <div className="text-xl font-bold text-center mb-4 text-black">
          <h3>Add Product</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col mb-4 ">
            <LabelAndInput
              id="productName"
              type="text"
              name="productName"
              text="product name"
              value={product.productName}
              textStyle="text-base font-medium"
              handleChange={(e) =>
                handleChange({ e, setData: setProduct, setErrors })
              }
              padding="p-[4px]"
              placeholder="Product Name"
              error={errors.productName}
            />
          </div>
          <div className="flex flex-col text-md mb-4">
            <Select
              id="category"
              name="category"
              options={filteredOptions}
              value={product.category}
              onChange={(e) =>
                handleSelectChange({
                  e,
                  setData: setProduct,
                  setErrors,
                })
              }
              textStyle="text-base font-medium"
              error={errors.category}
            />
          </div>
          <div className="flex flex-col text-md">
            <h2 className="text-base font-medium">Stock</h2>
            {product.stock.map((stockItem, index) => (
              <div key={index} className="relative flex gap-2 mb-4">
                <div className="w-full flex flex-col text-md p-">
                  <LabelAndInput
                    id={`variant-${index}`}
                    type="text"
                    name={`stock[${index}].variant`}
                    text="variant"
                    value={stockItem.variant}
                    textStyle="text-xs font-medium"
                    handleChange={(e) =>
                      handleStockChange(index, "variant", e.target.value)
                    }
                    padding="p-[6px]"
                    placeholder="Variant"
                    error={errors?.[`stock[${index}].variant`]}
                  />
                </div>
                <div className="w-full flex flex-col text-md">
                  <LabelAndInput
                    id={`quantity-${index}`}
                    type="number"
                    name={`stock[${index}].quantity`}
                    text="quantity"
                    value={stockItem.quantity}
                    textStyle="text-xs font-medium"
                    handleChange={(e) =>
                      handleStockChange(index, "quantity", e.target.value)
                    }
                    padding="p-[6px]"
                    placeholder="Quantity"
                    error={errors?.[`stock[${index}].quantity`]}
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              className="w-fit ml-auto flex justify-center items-center"
              onClick={handleAddStockField}
            >
              <i className="bx bxs-plus-circle text-gray-500 text-[20px]"></i>
            </button>
          </div>
          <div className="flex flex-col text-md mb-4">
            <LabelAndInput
              id="price"
              type="text"
              name="price"
              text="price"
              value={product.price}
              textStyle="text-base font-medium"
              handleChange={(e) =>
                handlePriceChange({
                  e,
                  setData: setProduct,
                  setErrors,
                  setRawPrice,
                })
              }
              padding="p-[4px]"
              placeholder="Price"
              error={errors.price}
            />
          </div>
          <div className="mb-4">
            <SubmitButton
              disabled={false}
              type="submit"
              isLoading={""}
              text="Add"
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ModalAddData;
