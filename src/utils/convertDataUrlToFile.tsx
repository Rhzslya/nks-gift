export const convertDataUrlToFile = (
  dataUrl: string,
  fileName: string
): File => {
  const arr = dataUrl.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);

  if (!mimeMatch) {
    throw new Error("Invalid data URL: No MIME type found.");
  }

  const mime = mimeMatch[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) u8arr[n] = bstr.charCodeAt(n);

  return new File([u8arr], fileName, { type: mime });
};