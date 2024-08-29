export const getInitials = (username: string): string => {
  // Memisahkan username berdasarkan spasi
  const parts = username.split(" ");
  let initials = "";

  for (const part of parts) {
    if (part.length > 0 && initials.length < 2) {
      initials += part[0].toUpperCase();
    }
    if (initials.length === 2) {
      break;
    }
  }

  return initials;
};
