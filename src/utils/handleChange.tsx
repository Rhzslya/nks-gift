import { ChangeEvent, Dispatch, SetStateAction } from "react";

interface HandleChangeParams<T extends Record<string, any>> {
  e: ChangeEvent<HTMLInputElement>;
  setData: Dispatch<SetStateAction<T>>;
  setErrors: Dispatch<SetStateAction<Record<string, string>>>;
  setIsModified?: Dispatch<SetStateAction<boolean>>;
}

export const handleChange = <T extends Record<string, any>>({
  e,
  setData,
  setErrors,
  setIsModified,
}: HandleChangeParams<T>) => {
  const { name, value } = e.target;

  setData((prevData) => {
    if (name.includes(".")) {
      const keys = name.split(".");
      const [firstKey, secondKey] = keys;
      return {
        ...prevData,
        [firstKey]: {
          ...prevData[firstKey],
          [secondKey]: value,
        },
      };
    }

    return {
      ...prevData,
      [name]: value,
    };
  });

  // Remove specific error message when user starts typing
  setErrors((prevErrors) => ({
    ...prevErrors,
    [name]: "",
  }));

  // Optionally set isModified to true
  setIsModified?.(true);
};

interface HandlePasswordChangeProps<T extends Record<string, any>> {
  e: ChangeEvent<HTMLInputElement>;
  setPasswordCriteria: Dispatch<
    SetStateAction<{
      length: boolean;
      combination: boolean;
      specialChar: boolean;
    }>
  >;
  setData: Dispatch<SetStateAction<T>>;
  setErrors: Dispatch<SetStateAction<Record<string, string>>>;
}

export const handlePasswordChange = <T extends Record<string, any>>({
  e,
  setPasswordCriteria,
  setData,
  setErrors,
}: HandlePasswordChangeProps<T>) => {
  const { value, name } = e.target;

  // Validate password criteria
  setPasswordCriteria({
    length: value.length >= 8,
    combination: /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/.test(value),
    specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
  });

  // Use handleChange to update user data and handle errors
  handleChange({
    e,
    setData,
    setErrors,
  });
};

interface HandlePriceChangeProps<T extends Record<string, any>> {
  e: ChangeEvent<HTMLInputElement>;
  setData: Dispatch<SetStateAction<T>>;
  setErrors: Dispatch<SetStateAction<Record<string, string>>>;
  setRawPrice: Dispatch<SetStateAction<string>>;
  setIsModified?: Dispatch<SetStateAction<boolean>>;
  // Menyimpan nilai asli (tanpa titik)
}

export const handlePriceChange = <T extends Record<string, any>>({
  e,
  setData,
  setErrors,
  setRawPrice,
  setIsModified,
}: HandlePriceChangeProps<T>) => {
  const { name, value } = e.target;

  // Hapus titik dari nilai yang diformat untuk mendapatkan angka murni (raw value)
  const rawValue = value.replace(/\./g, "");

  // Cek apakah raw value adalah angka yang valid
  if (isNaN(Number(rawValue))) return;

  // Format angka dengan pemisah ribuan
  const formattedValue = new Intl.NumberFormat("id-ID").format(
    Number(rawValue)
  );

  // Simpan raw value tanpa titik untuk pemrosesan lebih lanjut
  setRawPrice(rawValue);

  // Perbarui state dengan nilai yang diformat untuk ditampilkan di UI
  setData((prevData) => ({
    ...prevData,
    [name]: formattedValue,
  }));

  // Hapus error untuk field price jika user mengetik ulang
  setErrors((prevErrors) => ({
    ...prevErrors,
    [name]: "",
  }));
  setIsModified?.(true);
};

export const handleSelectChange = <T extends Record<string, any>>({
  e,
  setData,
  setErrors,
}: {
  e: React.ChangeEvent<HTMLSelectElement>;
  setData: React.Dispatch<React.SetStateAction<T>>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) => {
  const { name, value } = e.target;

  // Update the state with the selected value
  setData((prevData) => ({
    ...prevData,
    [name]: value,
  }));

  // Clear error for the field when user selects a valid option
  if (value) {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  }
};

export const handleStockChange = <T extends Record<string, any>>({
  index,
  field,
  value,
  setData,
  setErrors,
}: {
  index: number;
  field: keyof T["stock"][number];
  value: string;
  setData: React.Dispatch<React.SetStateAction<T>>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) => {
  setData((prevData) => {
    // Deep copy the stock array
    const newStock = prevData.stock.map((stockItem: any) => ({ ...stockItem }));
    newStock[index][String(field)] = value;

    return {
      ...prevData,
      stock: newStock, // Assign the deeply cloned stock array
    };
  });

  if (value) {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [`stock[${index}].${String(field)}`]: "",
    }));
  }
};

export const handleInputFileChange = <T extends Record<string, any>>({
  e,
  setData,
  setErrors,
  setIsModified,
  setSelectedImage,
  fieldName, // Field yang akan diupdate di dalam state
}: {
  e: React.ChangeEvent<HTMLInputElement>;
  setData: React.Dispatch<React.SetStateAction<T>>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setIsModified?: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedImage: React.Dispatch<React.SetStateAction<File | null>>;
  fieldName: string; // Ditambahkan agar lebih fleksibel, misalnya untuk field 'productImage'
}) => {
  const file = e.target.files?.[0] || null;
  setSelectedImage(file);

  if (file) {
    // Membuat preview URL dari file yang diunggah
    const previewUrl = URL.createObjectURL(file);

    // Set data untuk field yang sesuai (misal: productImage atau lainnya)
    setData((prevData) => ({
      ...prevData,
      [fieldName]: previewUrl, // Menggunakan fieldName yang dinamis
    }));

    // Reset error untuk field ini
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: "", // Menggunakan fieldName yang dinamis
    }));
  } else {
    // Jika tidak ada file yang dipilih atau file tidak valid
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: "Please select a valid image file",
    }));
  }

  // Menandai bahwa data telah diubah (jika opsi setIsModified disediakan)
  if (setIsModified) {
    setIsModified(true);
  }
};
