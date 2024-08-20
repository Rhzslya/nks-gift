export const convertNumber = (phoneNumber: any) => {
  // Jika nomor dimulai dengan '0', ganti dengan '62'
  if (phoneNumber.startsWith("0")) {
    return "62" + phoneNumber.slice(1);
  }
  return phoneNumber;
};
