import React, { useEffect, useRef, useState } from "react";
import Modal from "@/components/Fragments/Modal";
import LabelAndInput from "@/components/Form/Label";
import Select from "@/components/Select";
import SubmitButton from "@/components/Button/SubmitButton";
import {
  handleChange,
  handleInputFileChange,
  handlePriceChange,
  handleSelectChange,
  handleStockChange,
} from "@/utils/handleChange";
import { validationAddProduct } from "@/utils/Validations";
import { uploadProductImage } from "@/lib/firebase/services";
import InputFile from "@/components/Form/Label/InputFile";
import { ProductCategories } from "@/utils/ProductCategories";
interface Product {
  productImage: string;
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
    productImage: "",
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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const handleAddStockField = () => {
    // Cek apakah semua stock item sudah memiliki nilai untuk variant dan quantity
    const allFieldsFilled = product.stock.every(
      (stockItem) => stockItem.variant !== "" && stockItem.quantity !== ""
    );

    if (allFieldsFilled) {
      setProduct((prev) => ({
        ...prev,
        stock: [...prev.stock, { variant: "", quantity: "" }],
      }));
    } else {
      setMessage("Please fill in all existing fields before adding more.");
    }
  };

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0] || null;
  //   setSelectedImage(file);

  //   if (file) {
  //     const previewUrl = URL.createObjectURL(file);
  //     setProduct((prevProduct: Product) => ({
  //       ...prevProduct,
  //       productImage: previewUrl,
  //     }));
  //   }
  // };

  const handleClickLabel = (e: any) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validationAddProduct(product);
    setIsLoading(true);

    setErrors(validationErrors);

    const stock = product.stock.map(
      (item: { variant: string; quantity: string }) => ({
        variant: item.variant,
        quantity: parseInt(item.quantity), // Parsing kuantitas di frontend
      })
    );

    const products = {
      ...product,
      price: Number(rawPrice),
      stock,
      categoryInitial: product.category.charAt(0).toUpperCase(), // Kirimkan huruf kategori saja
      // Use raw price for actual data submission
    };

    try {
      if (Object.keys(validationErrors).length === 0) {
        if (selectedImage && selectedImage.size >= 1048576) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            productImage: "Image size must be less than 1MB",
          }));
          setIsLoading(false); // Sembunyikan loading karena ada error
          return; // Hentikan proses jika file terlalu besar
        }

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
          const newProductId = data.data._id;

          if (selectedImage) {
            const newImageURL = await uploadProductImage(
              newProductId,
              selectedImage,
              setUploadProgress
            );
            if (newImageURL && typeof newImageURL === "string") {
              const putResponse = await fetch(`/api/products`, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${accessToken}`,
                },
                method: "PUT",
                body: JSON.stringify({
                  _id: newProductId,
                  data: {
                    ...data.data,
                    productImage: newImageURL,
                  },
                }),
              });

              const product = await putResponse.json();
              onProductAdded(product.data);
              setShowModalAddData(false);
            }
          }
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

  // Delete Message
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <Modal onClose={handleCloseModal}>
      <div className="w-[500px]  overflow-y-auto max-h-[550px] text-black">
        <div className="text-xl font-bold text-center mb-4 text-black">
          <h3>Add New Product</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col justify-center items-center gap-2 flex-grow mb-4">
            <InputFile
              id="product_image"
              htmlfor="product_image"
              title="Product Image"
              text="Click to Upload Product Image"
              data={product.productImage}
              error={errors.productImage}
              handleChange={(e) =>
                handleInputFileChange({
                  e,
                  setData: setProduct,
                  setErrors,
                  setSelectedImage,
                  fieldName: "productImage", // Field yang di-update
                })
              }
              selectedImage={selectedImage}
              handleClickLabel={handleClickLabel}
              ref={fileInputRef}
            />
          </div>
          <div className="flex flex-col mb-4">
            <LabelAndInput
              id="productName"
              type="text"
              name="productName"
              text="product name"
              value={product.productName}
              textStyle="text-sm font-medium"
              handleChange={(e) =>
                handleChange({ e, setData: setProduct, setErrors })
              }
              padding="p-2"
              placeholder="Product Name"
              error={errors.productName}
            />
          </div>
          <div className="flex flex-col text-md mb-4">
            <Select
              id="category"
              name="category"
              options={[
                { value: "", label: "Select Category" },
                ...ProductCategories,
              ]}
              value={product.category}
              onChange={(e) =>
                handleSelectChange({
                  e,
                  setData: setProduct,
                  setErrors,
                })
              }
              textStyle="text-sm font-medium"
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
                      handleStockChange({
                        index,
                        field: "variant",
                        value: e.target.value,
                        setData: setProduct,
                        setErrors: setErrors,
                      })
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
                      handleStockChange({
                        index,
                        field: "quantity",
                        value: e.target.value,
                        setData: setProduct,
                        setErrors: setErrors,
                      })
                    }
                    padding="p-[6px]"
                    placeholder="Quantity"
                    error={errors?.[`stock[${index}].quantity`]}
                  />
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center">
              <div className="password-criteria flex flex-col mt-2 text-[12px]">
                <p className="text-red-500">{message}</p>
              </div>
              <button
                type="button"
                className="w-fit flex justify-center items-center"
                onClick={handleAddStockField}
              >
                <i className="bx bxs-plus-circle text-gray-500 text-[20px]"></i>
              </button>
            </div>
          </div>
          <div className="flex flex-col text-md mb-4">
            <LabelAndInput
              id="price"
              type="text"
              name="price"
              text="price"
              value={product.price}
              textStyle="text-sm font-medium"
              handleChange={(e) =>
                handlePriceChange({
                  e,
                  setData: setProduct,
                  setErrors,
                  setRawPrice,
                })
              }
              padding="p-2"
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
