export const resizeImage = (
  file: File,
  maxWidth: number,
  maxHeight: number
) => {
  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = maxWidth;
        canvas.height = maxHeight;

        ctx?.drawImage(img, 0, 0, maxWidth, maxHeight);

        const resizedDataUrl = canvas.toDataURL("image/jpeg");
        resolve(resizedDataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};
