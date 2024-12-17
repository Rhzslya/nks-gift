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

      // Ukuran asli gambar
      const originalWidth = img.width;
      const originalHeight = img.height;

      // Hitung scaling dinamis
      const scale = Math.min(
        maxWidth / originalWidth,
        maxHeight / originalHeight,
        1 // Scale tidak melebihi 1
      );

      // Tentukan ukuran akhir gambar setelah scaling
      const finalWidth = Math.round(originalWidth * scale);
      const finalHeight = Math.round(originalHeight * scale);

      // Set canvas dan gambar
      canvas.width = finalWidth;
      canvas.height = finalHeight;
      ctx.drawImage(img, 0, 0, finalWidth, finalHeight);

      resolve(canvas.toDataURL());
    };
    img.onerror = reject;
  });
};

export default resizeImage;
