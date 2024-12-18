const resizeImage = (
  file: File,
  maxWidth: number,
  maxHeight: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas context not supported");

      const originalWidth = img.width;
      const originalHeight = img.height;

      const scale = Math.min(
        maxWidth / originalWidth,
        maxHeight / originalHeight,
        1
      );

      let finalWidth = Math.round(originalWidth * scale);
      let finalHeight = Math.round(originalHeight * scale);

      if (finalWidth < 150 || finalHeight < 200) {
        const widthDiff = 150 - finalWidth > 0 ? 150 - finalWidth : 0;
        const heightDiff = 200 - finalHeight > 0 ? 200 - finalHeight : 0;

        if (widthDiff > 0) {
          const proportion = widthDiff / finalWidth;
          finalHeight += Math.round(finalHeight * proportion);
          finalWidth = 150;
        }

        if (heightDiff > 0) {
          const proportion = heightDiff / finalHeight;
          finalWidth += Math.round(finalWidth * proportion);
          finalHeight = 200;
        }
      }

      canvas.width = finalWidth;
      canvas.height = finalHeight;
      ctx.drawImage(img, 0, 0, finalWidth, finalHeight);

      resolve(canvas.toDataURL());
    };
    img.onerror = (err) => reject(`Failed to load image. Error: ${err}`);
  });
};

export default resizeImage;
