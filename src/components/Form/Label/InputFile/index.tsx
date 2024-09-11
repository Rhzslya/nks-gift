import React, { useRef } from "react";
import Image from "next/image";

interface InputFileProps<T> {
  id: string;
  type?: string; // Bisa digunakan untuk menentukan tipe input (default: file)
  text: string;
  title: string; // Title yang bisa diubah-ubah
  imageField?: keyof T; // Nama field dalam data yang berisi URL gambar
  altField?: keyof T; // Nama field dalam data yang berisi alt text (opsional)
  data: T; // Menggunakan generik T untuk mendukung tipe data apapun
  error?: string | string[] | null;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedFile?: File | null; // Bisa untuk file apapun, bukan hanya image
  handleClickLabel?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  fileInputRef: any;
}

const InputFile = <T,>({
  id,
  type = "file", // Default type adalah file
  text,
  title,
  imageField,
  altField,
  data,
  error,
  handleChange,
  selectedFile,
  handleClickLabel,
  fileInputRef,
}: InputFileProps<T>) => {
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (handleChange) {
      handleChange(e);
    }
  };

  // Dapatkan image URL dan alt text dari field yang dinamis (jika ada)
  const imageUrl = imageField && data[imageField as keyof T];
  const altText = altField && data[altField as keyof T];

  return (
    <>
      <div>
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      </div>
      {imageField && (
        <div className="flex items-center bg-gray-100 p-2 rounded-sm">
          {imageUrl ? (
            <Image
              src={imageUrl as string} // Pastikan imageURL adalah string
              width={100}
              height={100}
              alt={(altText as string) || "Image"} // Default alt text
              quality={100}
              className="h-24 w-24 object-cover rounded-sm"
            />
          ) : (
            <Image
              src={"/default.jpg"}
              width={100}
              height={100}
              alt="Default"
              quality={100}
              className="h-24 w-24 object-cover rounded-sm"
            />
          )}
        </div>
      )}
      <label
        title={text} // Bisa diubah-ubah sesuai dengan props
        htmlFor={id}
        className="relative w-full"
      >
        <button
          type="button"
          onClick={handleClickLabel}
          className="relative border-dashed border-[2px] border-gray-200 p-6 rounded-md text-gray-600 w-full"
        >
          {selectedFile ? (
            <div className="relative z-10 flex flex-col justify-center items-center text-gray-600 min-h-[76.75px]">
              <small>
                <strong>{selectedFile.name}</strong>
              </small>
              <small>
                Click Save and Upload to save and upload your new Product
                Picture.
              </small>
              <small>
                If you wish to change the image, please select a different file.
              </small>
            </div>
          ) : (
            <>
              <div className="absolute inset-0 flex justify-center items-center z-0">
                <i className="bx bx-upload text-[80px] text-gray-300"></i>
              </div>

              <div className="relative z-10 flex flex-col justify-center items-center text-gray-600 min-h-[76.75px]">
                <small className="">
                  Click here to upload a Product picture.
                </small>
                <small className="">
                  Accepted formats: JPG, PNG (Max size: 1MB).
                </small>
                <small className="">
                  For best results, use a clear image with a minimum resolution
                  of 300x300 pixels.
                </small>
              </div>
            </>
          )}
        </button>
        {error && (
          <div className="password-criteria flex flex-col mt-2 text-[12px]">
            <p className="text-red-500">
              {Array.isArray(error) ? error.join(", ") : error}
            </p>
          </div>
        )}
        <div className="absolute w-full h-full top-0 -z-10 opacity-0 flex justify-center items-center">
          <input
            type={type}
            accept="image/png, image/jpeg, image/jpg" // Bisa disesuaikan
            id={id}
            onChange={handleInputChange}
            ref={fileInputRef}
          />
        </div>
      </label>
    </>
  );
};

export default InputFile;
