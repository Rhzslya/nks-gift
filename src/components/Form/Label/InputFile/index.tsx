import React, { forwardRef } from "react";
import Image from "next/image";

interface InputFileProps {
  id: string;
  type?: string;
  text: string;
  title: string;
  data: any;
  error?: string | string[] | null;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedFile?: File | null;
  handleClickLabel?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  selectedImage: any;
  htmlfor: string;
}

const InputFile = forwardRef<HTMLInputElement, InputFileProps>(
  (
    {
      id,
      text,
      title,
      data,
      error,
      handleChange,
      htmlfor,
      handleClickLabel,
      selectedImage,
    }: InputFileProps,
    ref
  ) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (handleChange) {
        handleChange(e);
      }
    };

    return (
      <>
        <div>
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        </div>
        <div className="flex items-center bg-gray-100 p-2 rounded-sm">
          {data ? (
            <Image
              src={data}
              width={100}
              height={100}
              alt={data || ""}
              quality={100}
              className="w-full h-full bg-cover"
            />
          ) : (
            <Image
              src={"/default.jpg"}
              width={100}
              height={100}
              alt={data || ""}
              quality={100}
              className="h-[300px] w-[200px] object-cover rounded-sm"
            />
          )}
        </div>
        <label
          title={`Click to Upload Your ${title}`}
          htmlFor={htmlfor}
          className="relative w-full"
        >
          <button
            type="button"
            onClick={handleClickLabel}
            className="relative border-dashed border-[2px] border-gray-200 p-6 rounded-md text-gray-600 w-full"
          >
            {selectedImage ? (
              <div className="relative z-10 flex flex-col justify-center items-center text-gray-600 min-h-[76.75px]">
                <small>
                  <strong>{selectedImage.name}</strong>
                </small>
                <small>
                  Click Save and Upload to save and upload your new Product
                  Picture.
                </small>
                <small>
                  If you wish to change the image, please select a different
                  file.
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
                    For best results, use a clear image with a minimum
                    resolution of 300x300 pixels.
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
          <div className="absolute w-full h-full top-0 -z-10 opacity-0  flex justify-center items-center">
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              id={id}
              onChange={handleInputChange}
              ref={ref}
            />
          </div>
        </label>
      </>
    );
  }
);

// Menambahkan display name
InputFile.displayName = "InputFile";

export default InputFile;
