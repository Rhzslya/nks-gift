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

      if (finalWidth < 400 || finalHeight < 400) {
        const widthDiff = 400 - finalWidth > 0 ? 400 - finalWidth : 0;
        const heightDiff = 400 - finalHeight > 0 ? 400 - finalHeight : 0;

        if (widthDiff > 0) {
          const proportion = widthDiff / finalWidth;
          finalHeight += Math.round(finalHeight * proportion);
          finalWidth = 400;
        }

        if (heightDiff > 0) {
          const proportion = heightDiff / finalHeight;
          finalWidth += Math.round(finalWidth * proportion);
          finalHeight = 400;
        }
      }

      canvas.width = finalWidth;
      canvas.height = finalHeight;

      // Pastikan rendered size sama dengan intrinsic size

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      resolve(canvas.toDataURL());
    };
    img.onerror = (err) => reject(`Failed to load image. Error: ${err}`);
  });
};

export default resizeImage;
