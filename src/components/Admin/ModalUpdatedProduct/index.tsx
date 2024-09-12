import LabelAndInput from "@/components/Form/Label";
import MessageFromAPI from "@/components/Form/MessageFromAPI";
import Modal from "@/components/fragements/Modal";
import { capitalizeFirst } from "@/utils/Capitalize";
import { formatPriceToIDR } from "@/utils/FormatPrice";
import { handleChange } from "@/utils/handleChange";
import React, { useState } from "react";

interface Product {
  _id: any;
  productImage: string;
  productName: string;
  price: number;
  category: any;
  stock: {
    variant: string;
    quantity: string;
  }[];
  productId: string;
}

const ModalUpdatedProduct = ({ handleCloseModal, isUpdatedProduct }: any) => {
  const [message, setMessage] = useState("");
  const [updatedProduct, setUpdatedProduct] =
    useState<Product>(isUpdatedProduct);
  const [errors, setErrors] = useState({});
  console.log(updatedProduct);
  return (
    <Modal onClose={handleCloseModal}>
      <div className="w-[400px]">
        <div className="text-xl font-bold text-center mb-4">
          <h3>Edit Product</h3>
        </div>
        <form>
          <MessageFromAPI message={message} />

          <div className="flex flex-col mb-4">
            <LabelAndInput
              id="productName"
              type="text"
              name="productName"
              text="Product Name"
              value={updatedProduct.productName}
              // disabled
              handleChange={(e) =>
                handleChange({ e, setData: setUpdatedProduct, setErrors })
              }
              textStyle="text-xs font-medium"
            />
          </div>
          <div className="flex flex-col mb-4">
            <LabelAndInput
              id="productId"
              type="text"
              name="productId"
              text="Product ID"
              value={updatedProduct.productId}
              disabled
              textStyle="text-xs font-medium"
            />
          </div>
          <div className="flex flex-col mb-4">
            <LabelAndInput
              id="category"
              type="text"
              name="category"
              text="Category"
              value={capitalizeFirst(updatedProduct.category)}
              disabled
              textStyle="text-xs font-medium"
            />
          </div>
          <div className="flex flex-col mb-4">
            <LabelAndInput
              id="price"
              type="number"
              name="price"
              text="Category"
              value={formatPriceToIDR(Number(updatedProduct.price))}
              disabled
              textStyle="text-xs font-medium"
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ModalUpdatedProduct;
