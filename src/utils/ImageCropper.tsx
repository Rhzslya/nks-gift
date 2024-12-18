import React, { useEffect, useRef, useState } from "react";
import ReactCrop, { convertToPixelCrop, Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import setCanvasPreview from "./setCanvasPreview";
import Image from "next/image";

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;
const FIXED_CROP_WIDTH_SIZE = 150;
const FIXED_CROP_HEIGHT_SIZE = 200;

const ImageCropper = ({
  imageSrc,
  setImageSrc,
  setDataUrlImageCropper,
}: {
  imageSrc: string;
  setImageSrc: (value: string) => void;
  setDataUrlImageCropper: (value: string) => void;
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
      unit: "px", // Tipe unit harus "px"
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

  return (
    <>
      <div className="flex items-center justify-center w-[600px] h-[400px] bg-gray-500">
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

      <button
        className="text-gray-500"
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
