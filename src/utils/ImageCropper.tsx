import React, { useRef, useState } from "react";
import ReactCrop, { convertToPixelCrop, Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import setCanvasPreview from "./setCanvasPreview";
import Image from "next/image";

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;
const FIXED_CROP_WIDTH_SIZE = 200;
const FIXED_CROP_HEIGHT_SIZE = 200;

const ImageCropper = ({
  imageSrc,
  setImageSrc,
  setDataUrlImageCropper,
  setSelectedImage,
}: {
  imageSrc: string;
  setImageSrc: (value: string) => void;
  setDataUrlImageCropper: (value: string) => void;
  setSelectedImage: (value: File | null) => void;
}) => {
  const [crop, setCrop] = useState<Crop | undefined>({
    unit: "px",
    width: FIXED_CROP_WIDTH_SIZE,
    height: FIXED_CROP_HEIGHT_SIZE,
    x: 0,
    y: 0,
  });

  // Berikan tipe yang sesuai untuk imageRef dan previewCanvasRef
  const imageRef = useRef<HTMLImageElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const onImageLoad = (e: any) => {
    const { width, height, naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
      setImageSrc("");
      return;
    }
    const initialCrop: Crop = {
      unit: "px",
      width: FIXED_CROP_WIDTH_SIZE,
      height: FIXED_CROP_HEIGHT_SIZE,
      x: (width - FIXED_CROP_WIDTH_SIZE) / 2,
      y: (height - FIXED_CROP_HEIGHT_SIZE) / 2,
    };
    setCrop(initialCrop);
  };

  const handleCropChange = (newCrop: Crop) => {
    newCrop.width = FIXED_CROP_WIDTH_SIZE;
    newCrop.height = FIXED_CROP_HEIGHT_SIZE;

    if (imageRef.current) {
      const { naturalWidth, naturalHeight } = imageRef.current;

      if (newCrop.x + newCrop.width > naturalWidth) {
        newCrop.x = naturalWidth - newCrop.width;
      }
      if (newCrop.y + newCrop.height > naturalHeight) {
        newCrop.y = naturalHeight - newCrop.height;
      }
      if (newCrop.x < 0) {
        newCrop.x = 0;
      }
      if (newCrop.y < 0) {
        newCrop.y = 0;
      }
    }

    setCrop(newCrop);
  };

  const handleCancel = () => {
    if (imageSrc != "") {
      setImageSrc("");
      setSelectedImage(null);
    }
  };

  return (
    <>
      <div className="title text-gray-500 p-2">
        <h1 className="font-semibold">Crop Image</h1>
      </div>
      <div className="flex items-center justify-center w-[600px] h-[400px]  bg-gray-300">
        <ReactCrop
          crop={crop}
          onChange={handleCropChange}
          aspect={ASPECT_RATIO}
          keepSelection
        >
          <Image
            src={imageSrc}
            alt="Upload"
            onLoad={onImageLoad}
            ref={imageRef}
            width={FIXED_CROP_WIDTH_SIZE}
            height={FIXED_CROP_HEIGHT_SIZE}
            className="w-full h-full bg-cover"
          />
        </ReactCrop>
      </div>
      <div className="button-container flex p-2 items-center">
        <button onClick={handleCancel} className="text-gray-500">
          Cancel
        </button>
        <button
          className="text-gray-white text-sm ml-auto bg-sky-300 py-1 px-2 rounded-sm"
          onClick={() => {
            if (crop && imageRef.current && previewCanvasRef.current) {
              setCanvasPreview(
                imageRef.current,
                previewCanvasRef.current,
                convertToPixelCrop(
                  crop,
                  imageRef.current.width,
                  imageRef.current.height
                )
              );

              const dataUrl = previewCanvasRef.current.toDataURL();
              setDataUrlImageCropper(dataUrl);
            }
          }}
        >
          Apply
        </button>
      </div>

      {crop && (
        <canvas
          ref={previewCanvasRef}
          className="mt-4"
          style={{
            border: "1px solid black",
            objectFit: "contain",
            width: FIXED_CROP_WIDTH_SIZE,
            height: FIXED_CROP_HEIGHT_SIZE,
            display: "none",
          }}
        />
      )}
    </>
  );
};

export default ImageCropper;
