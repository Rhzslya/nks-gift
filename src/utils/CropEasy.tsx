import React, { useEffect, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import getCroppedImg from "./CropImage";

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
      <div
        style={{
          width: "100%",
          height: "500px",
          position: "relative",
        }}
      >
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

      <div style={{ margin: "auto", display: "flex", gap: "20px" }}>
        <label>
          Zoom:
          <input
            type="range"
            min={1}
            max={5}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          />
        </label>
        <label>
          Rotation:
          <input
            type="range"
            min={0}
            max={180}
            step={1}
            value={rotation}
            onChange={(e) => setRotation(Number(e.target.value))}
          />
        </label>
      </div>
      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <button
          onClick={handleApply}
          style={{ padding: "10px", backgroundColor: "green", color: "white" }}
        >
          Apply
        </button>
        <button
          onClick={handleCancel}
          style={{ padding: "10px", backgroundColor: "red", color: "white" }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CropEasy;
