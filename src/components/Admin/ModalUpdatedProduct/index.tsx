import SubmitButton from "@/components/Button/SubmitButton";
import LabelAndInput from "@/components/Form/Label";
import InputFile from "@/components/Form/Label/InputFile";
import MessageFromAPI from "@/components/Form/MessageFromAPI";
import Modal from "@/components/fragements/Modal";
import { uploadProductImage } from "@/lib/firebase/services";
import { capitalizeFirst } from "@/utils/Capitalize";
import {
  handleChange,
  handleInputFileChange,
  handlePriceChange,
  handleStockChange,
} from "@/utils/handleChange";
import { validationAddProduct } from "@/utils/Validations";
import React, { useEffect, useRef, useState } from "react";

interface Product {
  _id: any;
  productImage: string;
  productName: string;
  price: string;
  category: any;
  stock: {
    variant: string;
    quantity: string;
  }[];
  productId: string;
}

interface ProductErrors {
  productName?: string;
  price?: string;
  stock?: { variant?: string; quantity?: string }[];
  [key: string]: any; // Optional: Jika kamu ingin memperluas secara dinamis
}

const ModalUpdatedProduct = ({
  handleCloseModal,
  isUpdatedProduct,
  accessToken,
  setProductsData,
}: any) => {
  const [message, setMessage] = useState("");
  const [rawPrice, setRawPrice] = useState(isUpdatedProduct.price); // Initialize raw price from product price
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isModified, setIsModified] = useState(false);
  const [isLoading, setIsLoading] = useState("");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [updatedProduct, setUpdatedProduct] = useState<Product>({
    ...isUpdatedProduct,
    price: new Intl.NumberFormat("id-ID").format(
      Number(isUpdatedProduct.price)
    ),
  });
  const [errors, setErrors] = useState<ProductErrors>({});

  // Cek apakah ada perubahan pada updatedProduct
  useEffect(() => {
    const isChanged =
      JSON.stringify(updatedProduct) !==
      JSON.stringify({
        ...isUpdatedProduct,
        price: new Intl.NumberFormat("id-ID").format(
          Number(isUpdatedProduct.price)
        ),
      });

    setIsModified(isChanged);
  }, [updatedProduct, isUpdatedProduct]);

  const handleAddStockField = () => {
    // Cek apakah semua stock item sudah memiliki nilai untuk variant dan quantity
    const allFieldsFilled = updatedProduct.stock.every(
      (stockItem) => stockItem.variant !== "" && stockItem.quantity !== ""
    );

    if (allFieldsFilled) {
      setUpdatedProduct((prev) => ({
        ...prev,
        stock: [...prev.stock, { variant: "", quantity: "" }],
      }));
    } else {
      setMessage("Please fill in all existing fields before adding more.");
    }
  };

  const handleDeleteStock = (index: any) => {
    if (updatedProduct.stock.length > 1) {
      setUpdatedProduct((prevProduct) => {
        const newStock = prevProduct.stock.filter((_, i) => i !== index);
        return { ...prevProduct, stock: newStock };
      });
    } else {
      setMessage("At least one stock variant must remain.");
    }
  };

  const handleClickLabel = (e: any) => {
    e.preventDefault();
    fileInputRef.current?.click();
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
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Mencegah refresh halaman
    setIsLoading("submit-edit-product"); // Menampilkan loading saat proses berjalan

    const updatedStock = updatedProduct.stock.map((stockItem) => ({
      ...stockItem,
      quantity: stockItem.quantity.toString(),
    }));
    const validationErrors = validationAddProduct({
      ...updatedProduct,
      stock: updatedStock, // Pass stock with string quantities for validation
    });
    setErrors(validationErrors);
    try {
      if (Object.keys(validationErrors).length === 0) {
        let productImage = updatedProduct.productImage; // Inisialisasi gambar produk

        // Jika ada gambar baru yang dipilih, upload dan dapatkan URL baru
        if (selectedImage) {
          const newImageURL = await uploadProductImage(
            updatedProduct._id,
            selectedImage,
            setUploadProgress
          );
          if (newImageURL && typeof newImageURL === "string") {
            productImage = newImageURL;
          }
        }

        // Parsing stock sebelum dikirim ke backend
        const stock = updatedProduct.stock.map(
          (item: { variant: string; quantity: string }) => ({
            variant: item.variant,
            quantity: parseInt(item.quantity), // Parsing kuantitas di frontend
          })
        );

        // Kirim permintaan untuk mengupdate produk
        const response = await fetch(`/api/products`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          method: "PUT",
          body: JSON.stringify({
            _id: updatedProduct._id,
            data: {
              ...updatedProduct,
              productImage,
              stock, // Gambar produk (baru atau lama)
              price: Number(rawPrice), // Harga produk yang diubah menjadi angka
            },
          }),
        });

        const data = await response.json();

        // Jika berhasil, update data produk di tampilan
        if (response.ok) {
          setMessage(data.message);
          setProductsData((prevData: Product[]) =>
            prevData.map((product) =>
              product._id === updatedProduct._id
                ? { ...product, ...data.data }
                : product
            )
          );

          setTimeout(() => {
            handleCloseModal();
          }, 1000);
        } else {
          setMessage(data.message);
        }
      }
    } catch (error) {
      console.error(error); // Tangani error jika ada
    } finally {
      setIsLoading(""); // Sembunyikan loading setelah proses selesai
    }
  };

  console.log(message);

  return (
    <Modal onClose={handleCloseModal}>
      <div className="w-[500px]  overflow-y-auto max-h-[550px] text-black">
        <div className="text-xl font-bold text-center mb-4">
          <h3>Edit Product</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <MessageFromAPI message={message} />

          <div className="flex flex-col justify-center items-center gap-2 flex-grow mb-4">
            <InputFile
              id="product_image"
              htmlfor="product_image"
              title="Product Image"
              text="Click to Upload Product Image"
              data={updatedProduct.productImage}
              error={errors.productImage}
              handleChange={(e) =>
                handleInputFileChange({
                  e,
                  setData: setUpdatedProduct,
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
              text="Product Name"
              value={updatedProduct.productName}
              // disabled
              handleChange={(e) =>
                handleChange({
                  e,
                  setData: setUpdatedProduct,
                  setErrors,
                })
              }
              textStyle="text-xs font-medium"
              error={errors.productName}
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
          <div className="flex flex-col text-md">
            <h2 className="text-base font-medium">Stock</h2>
            {updatedProduct.stock.map((stockItem, index) => (
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
                        setData: setUpdatedProduct,
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
                        setData: setUpdatedProduct,
                        setErrors: setErrors,
                      })
                    }
                    padding="p-[6px]"
                    placeholder="Quantity"
                    error={errors?.[`stock[${index}].quantity`]}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteStock(index)}
                  className="mt-auto text-[20px] text-red-500 hover:text-red-400 duration-300"
                >
                  <i className="bx bxs-trash"></i>
                </button>
              </div>
            ))}
            <div className="fle items-center ml-auto">
              <button
                type="button"
                className="w-fit flex justify-center items-center"
                onClick={handleAddStockField}
              >
                <i className="bx bxs-plus-circle text-gray-500 text-[20px]"></i>
              </button>
            </div>
          </div>
          <div className="flex flex-col mb-4">
            <LabelAndInput
              id="price"
              type="text"
              name="price"
              text="price"
              value={updatedProduct.price}
              textStyle="text-sm font-medium"
              handleChange={(e) =>
                handlePriceChange({
                  e,
                  setData: setUpdatedProduct,
                  setErrors,
                  setRawPrice,
                })
              }
              padding="p-2"
              placeholder="Price"
              error={errors.price}
            />
          </div>
          <div className="flex flex-col mb-4">
            <SubmitButton
              type="submit"
              disabled={!isModified}
              text="Save"
              isLoading={isLoading === "submit-edit-product" ? isLoading : ""}
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ModalUpdatedProduct;
