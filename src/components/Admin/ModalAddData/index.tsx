import React, { useEffect, useState } from "react";
import Modal from "@/components/fragements/Modal";
import LabelAndInput from "@/components/Form/Label";
import Select from "@/components/Select";
import SubmitButton from "@/components/Button/SubmitButton";
import { capitalizeFirst } from "@/utils/Capitalize";
import MessageFromAPI from "@/components/Form/MessageFromAPI";
import { useRouter } from "next/navigation";
import { handleChange } from "@/utils/handleChange";
interface Product {
  productName: string;
  productId: string;
  category: string;
  stock: string;
  price: string;
}

interface ModalUpdatedUserProps {
  handleCloseModal: () => void;
}

const ModalAddData: React.FC<ModalUpdatedUserProps> = ({
  handleCloseModal,
}) => {
  const [product, setProduct] = useState({
    productName: "",
    productId: "",
    category: "",
    stock: "",
    price: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {};
  return (
    <Modal onClose={handleCloseModal}>
      <div className="w-[300px] text-black">
        <div className="text-xl font-bold text-center mb-4 text-black">
          <h3>Add Product</h3>
        </div>
        <form>
          <div className="flex flex-col mb-4 ">
            <LabelAndInput
              id="productName"
              type="text"
              name="productName"
              text="product name"
              value={product.productName}
              textStyle="text-xs font-medium"
              handleChange={(e) =>
                handleChange({ e, setData: setProduct, setErrors })
              }
            />
          </div>
          <div className="flex flex-col text-md mb-4">
            <LabelAndInput
              id="productId"
              type="text"
              name="productId"
              text="product ID"
              value={product.productId}
              textStyle="text-xs font-medium"
              handleChange={(e) =>
                handleChange({ e, setData: setProduct, setErrors })
              }
            />
          </div>
          <div className="flex flex-col text-md mb-4">
            <LabelAndInput
              id="category"
              type="text"
              name="category"
              text="category"
              value={product.category}
              textStyle="text-xs font-medium"
              handleChange={(e) =>
                handleChange({ e, setData: setProduct, setErrors })
              }
            />
          </div>
          <div className="flex flex-col text-md mb-4">
            <LabelAndInput
              id="stock"
              type="number"
              name="stock"
              text="stock"
              value={product.stock}
              textStyle="text-xs font-medium"
              handleChange={(e) =>
                handleChange({ e, setData: setProduct, setErrors })
              }
            />
          </div>
          <div className="flex flex-col text-md mb-4">
            <LabelAndInput
              id="price"
              type="number"
              name="price"
              text="price"
              value={product.price}
              textStyle="text-xs font-medium"
              handleChange={(e) =>
                handleChange({ e, setData: setProduct, setErrors })
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
