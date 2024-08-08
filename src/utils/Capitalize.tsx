export const capitalizeFirst = (inputString: string) => {
  return inputString
    .split(/[\s_]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
