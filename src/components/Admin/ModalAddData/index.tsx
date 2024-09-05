import React, { useEffect, useState } from "react";
import Modal from "@/components/fragements/Modal";
import LabelAndInput from "@/components/Form/Label";
import Select from "@/components/Select";
import SubmitButton from "@/components/Button/SubmitButton";
import { capitalizeFirst } from "@/utils/Capitalize";
import MessageFromAPI from "@/components/Form/MessageFromAPI";
import { useRouter } from "next/navigation";
import { handleChange, handlePriceChange } from "@/utils/handleChange";

interface Product {
  productName: string;
  category: string;
  stock: string;
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
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredOptions = [
    { value: "", label: "Select Category" },
    { value: "gift", label: "Gift" },
    { value: "flower", label: "Flower" },
    { value: "suprize", label: "Suprize" },
    { value: "snack", label: "Snack" },
  ];

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProduct((prev) => ({
      ...prev,
      category: e.target.value, // Extract the value from the event
    }));
  };

  const handleAddStockField = () => {
    setProduct((prev) => ({
      ...prev,
      stock: [
        ...prev.stock,
        { variant: "", quantity: "" }, // Menambahkan input baru untuk stock
      ],
    }));
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
    const products = {
      ...product,
      price: rawPrice, // Use raw price for actual data submission
    };
    console.log(products);
    const response = await fetch("/api/products", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      method: "POST",
      body: JSON.stringify({ products }),
    });

    const data = await response.json();
    if (response.ok) {
      onProductAdded(data.product);
      setShowModalAddData(false);
    }
  };

  return (
    <Modal onClose={handleCloseModal}>
      <div className="w-[400px] text-black">
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
            />
          </div>
          <div className="flex flex-col text-md mb-4">
            <Select
              id="category"
              name="category"
              options={filteredOptions}
              value={product.category}
              onChange={handleSelectChange}
              textStyle="text-base font-medium"
            />
          </div>
          <div className="flex flex-col text-md">
            <h2 className="text-base font-medium">Stock</h2>
            {product.stock.map((stockItem, index) => (
              <div key={index} className="flex gap-2 mb-4">
                <div className="flex flex-col text-md">
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
                  />
                </div>
                <div className="flex flex-col text-md">
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
