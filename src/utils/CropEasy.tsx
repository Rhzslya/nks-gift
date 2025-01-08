import React, { useEffect, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import getCroppedImg from "./CropImage";
import ConfirmButton from "@/components/Button/ConfirmButton";

interface CropEasyProps {
  imageSrc: string;
  setImageSrc: (value: string) => void;
  setDataUrlImageCropper: (value: string) => void;
  setSelectedImage: (value: File | null) => void;
}

const CropEasy: React.FC<CropEasyProps> = ({
  imageSrc,
  setImageSrc,
  setDataUrlImageCropper,
  setSelectedImage,
}) => {
  const [crop, setCrop] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleApply = async () => {
    if (croppedAreaPixels) {
      try {
        const croppedImage = await getCroppedImg(
          imageSrc,
          croppedAreaPixels,
          rotation
        );

        setDataUrlImageCropper(croppedImage as string);
        setImageSrc("");
        setSelectedImage(null);
      } catch (error) {
        console.error("Crop failed:", error);
      }
    }
  };

  const handleCancel = () => {
    setImageSrc("");
    setSelectedImage(null);
  };

  return (
    <div className="App">
      <div className="title text-gray-500 font-semibold mb-4">
        <h3>Crop Image</h3>
      </div>
      <div className="cropper relative w-full h-[500px]">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onRotationChange={setRotation}
          onCropComplete={onCropComplete}
          cropShape="rect"
          aspect={4 / 4}
        />
      </div>
      <div className=" py-4 text-gray-500 mx-4 flex items-center justify-center gap-4">
        <i className="bx bxs-image-alt text-2xl"></i>
        <input
          type="range"
          min={1}
          max={5}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="slider w-[70%]  h-2 bg-gray-500  rounded-lg appearance-none cursor-pointer"
        />
        <i className="bx bxs-image-alt text-4xl"></i>
      </div>
      <div className="flex justify-between mx-4">
        <ConfirmButton text="Cancel" variant="cancel" onClick={handleCancel} />

        <ConfirmButton text="Apply" variant="default" onClick={handleApply} />
      </div>
    </div>
  );
};

export default CropEasy;
