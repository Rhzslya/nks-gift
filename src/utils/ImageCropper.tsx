import React, { useRef, useState } from "react";
import ReactCrop, { convertToPixelCrop, Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import setCanvasPreview from "./setCanvasPreview";

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;
const FIXED_CROP_SIZE = 200; // Ukuran tetap crop, misalnya 200px x 200px

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
    width: FIXED_CROP_SIZE,
    height: FIXED_CROP_SIZE,
    x: 0,
    y: 0,
  });
  const [error, setError] = useState<string>("");

  // Berikan tipe yang sesuai untuk imageRef dan previewCanvasRef
  const imageRef = useRef<HTMLImageElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const onImageLoad = (e: any) => {
    const { width, height, naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
      setError("Image Must be at least 150 x 150 pixels.");
      setImageSrc("");
      return;
    }
    const initialCrop: Crop = {
      unit: "px", // Tipe unit harus "px"
      width: FIXED_CROP_SIZE,
      height: FIXED_CROP_SIZE,
      x: (width - FIXED_CROP_SIZE) / 2, // Memusatkan crop
      y: (height - FIXED_CROP_SIZE) / 2, // Memusatkan crop
    };
    setCrop(initialCrop);
  };

  const handleCropChange = (newCrop: Crop) => {
    if (newCrop.width && newCrop.height) {
      if (
        newCrop.width !== FIXED_CROP_SIZE ||
        newCrop.height !== FIXED_CROP_SIZE
      ) {
        newCrop.width = FIXED_CROP_SIZE;
        newCrop.height = FIXED_CROP_SIZE;
      }
    }
    setCrop(newCrop);
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <ReactCrop
          crop={crop}
          onChange={handleCropChange}
          aspect={ASPECT_RATIO}
          keepSelection
        >
          <img
            src={imageSrc}
            alt="Upload"
            onLoad={onImageLoad}
            ref={imageRef}
          />
        </ReactCrop>
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
            } else {
              setError("Please select a crop area first.");
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
            width: FIXED_CROP_SIZE,
            height: FIXED_CROP_SIZE,
          }}
        />
      )}
    </>
  );
};

export default ImageCropper;
