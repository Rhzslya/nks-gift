const getCroppedImg = (
  imageSrc: string,
  croppedAreaPixels: any,
  rotation: number
): Promise<string> => {
  const image = new Image();
  image.src = imageSrc;

  return new Promise((resolve, reject) => {
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject("Failed to get canvas context");
        return;
      }

      // Set canvas size to cropped area dimensions
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      console.log(canvas.width);
      console.log(canvas.height);

      // Apply rotation to the context
      ctx.save();
      ctx.translate(croppedAreaPixels.width / 2, croppedAreaPixels.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(
        -croppedAreaPixels.width / 2,
        -croppedAreaPixels.height / 2
      );

      // Draw the image on the canvas, scaling it to fit the cropped area
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      // Restore the canvas state after drawing
      ctx.restore();

      // Get the cropped image as a data URL
      const croppedImageUrl = canvas.toDataURL("image/jpeg");
      resolve(croppedImageUrl);
    };

    image.onerror = reject;
  });
};

export default getCroppedImg;
