export const convertNumber = (phoneNumber: any) => {
  if (!phoneNumber) return ""; // Handle undefined or null case
  if (phoneNumber.startsWith("0")) {
    return "62" + phoneNumber.slice(1);
  }
  return phoneNumber;
};
