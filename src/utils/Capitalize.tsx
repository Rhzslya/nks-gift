export const capitalizeFirst = (inputString: string) => {
  return inputString
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
