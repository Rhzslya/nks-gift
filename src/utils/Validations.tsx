type User = {
  username: string;
  email: string;
  password: string;
};

type UserLogin = {
  email: string;
  password: string;
};

type UserEmail = {
  email: string;
};

type UserResetPassword = {
  newPassword: string;
  confirmpassword: string;
};

type UserUpdatedProfile = {
  username: string;
  address: {
    street: string;
    state: string;
    city: string;
    country: string;
    postalCode: string;
  };
  numberPhone: string;
};

type Product = {
  productImage: string;
  productName: string;
  category: string;
  stock: {
    variant: string;
    quantity: string;
  }[];
  price: string;
};

export const validationRegister = (user: User) => {
  const errors: Record<string, string> = {};

  const email_pattern = /^[^\s@][^\s@]+@[^\s@]+\.[^\s@]{2,6}$/;
  const username_pattern = /^[A-Za-z\s]+$/;
  // Validasi Email
  if (!user.email) {
    errors.email = "Email is required";
  } else if (!email_pattern.test(user.email)) {
    errors.email = "Email is Invalid";
  }

  // Validasi Username
  if (!user.username) {
    errors.username = "Username is required";
  } else if (!username_pattern.test(user.username)) {
    errors.username = "Username cannot contain numbers";
  }

  // Validasi Password
  if (!user.password || user.password.length < 8) {
    errors.password = "Minimum of 8 characters";
  } else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/.test(user.password)) {
    errors.password =
      "Password must contain uppercase, lowercase, and one number";
  } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(user.password)) {
    errors.password = "Password must contain at least one special character";
  }

  return errors;
};

export const validationLogin = (user: UserLogin) => {
  const errors: Record<string, string> = {};
  const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,6}$/;

  if (!user.email) {
    errors.email = "Email is required";
  } else if (!email_pattern.test(user.email)) {
    errors.email = "Email is Invalid";
  }

  if (!user.password) {
    errors.password = "Password is required";
  }

  return errors;
};

export const validationEmail = (user: UserEmail) => {
  const errors: Record<string, string> = {};
  const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,6}$/;

  if (!user.email) {
    errors.email = "email is required";
  } else if (!email_pattern.test(user.email)) {
    errors.email = "Email is Invalid";
  }

  return errors;
};

export const validationPassword = (user: UserResetPassword) => {
  const errors: Record<string, string> = {};

  // Password validation
  if (!user.newPassword) {
    errors.newPassword = "Password is required";
  } else if (user.newPassword.length < 8) {
    errors.newPassword = "Password must be at least 8 characters long";
  } else if (!/[A-Z]/.test(user.newPassword)) {
    errors.newPassword = "Password must contain at least one uppercase letter";
  } else if (!/[a-z]/.test(user.newPassword)) {
    errors.newPassword = "Password must contain at least one lowercase letter";
  } else if (!/[0-9]/.test(user.newPassword)) {
    errors.newPassword = "Password must contain at least one number";
  } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(user.newPassword)) {
    errors.newPassword = "Password must contain at least one special character";
  }

  if (!user.confirmpassword) {
    errors.confirmpassword = "Confirm Password is required";
  } else if (
    user.newPassword &&
    user.confirmpassword &&
    user.newPassword !== user.confirmpassword
  ) {
    errors.confirmpassword = "Passwords do not match";
  }

  return errors;
};

export const validationUpdateProfile = (
  user: UserUpdatedProfile,
  initialNumberPhone: string
) => {
  const errors: Record<string, string> = {};
  const username_pattern = /^[A-Za-z\s]+$/;
  const numberPhone_pattern = /^[0-9+\s]+$/;

  // Validasi Username
  if (!user.username) {
    errors.username = "Username is required";
  } else if (!username_pattern.test(user.username)) {
    errors.username = "Username cannot contain numbers";
  }
  // Validasi Number Phone

  if (initialNumberPhone !== "") {
    if (user.numberPhone === "") {
      errors.numberPhone = "Number cannot be empty";
    } else if (user.numberPhone.length < 9) {
      errors.numberPhone = "Number too short";
    } else if (!numberPhone_pattern.test(user.numberPhone)) {
      errors.numberPhone = "Number contains invalid characters";
    } else if (
      !(user.numberPhone.startsWith("0") || user.numberPhone.startsWith("62"))
    ) {
      errors.numberPhone = "Number must start with 0 or 62";
    }
  } else if (initialNumberPhone === "" && user.numberPhone !== "") {
    if (user.numberPhone.length < 9) {
      errors.numberPhone = "Number too short";
    } else if (!numberPhone_pattern.test(user.numberPhone)) {
      errors.numberPhone = "Number contains invalid characters";
    } else if (
      !(user.numberPhone.startsWith("0") || user.numberPhone.startsWith("62"))
    ) {
      errors.numberPhone = "Number must start with 0 or 62";
    }
  }

  return errors;
};

export const validationAddProduct = (product: Product) => {
  const errors: Record<string, string> = {};

  // Validasi Product Name
  if (!product.productName.trim()) {
    errors.productName = "Product name is required";
  }

  // Validasi Category
  if (!product.category[0]) {
    errors.category = "Category is required";
  }

  // Validasi Stock (Variant & Quantity)
  product.stock.forEach((stockItem, index) => {
    if (!stockItem.variant.trim()) {
      errors[`stock[${index}].variant`] = `Variant is required`;
    }
    if (!stockItem.quantity.trim() || isNaN(Number(stockItem.quantity))) {
      errors[`stock[${index}].quantity`] = `Quantity is Required`;
    } else if (Number(stockItem.quantity) <= 0) {
      errors[`stock[${index}].quantity`] = `Quantity must be greater than 0`;
    }
  });

  // Validasi Price
  const cleanedPrice = product.price.toString().trim().replace(/\./g, "");

  if (!cleanedPrice || isNaN(Number(cleanedPrice))) {
    errors.price = "Price is required and must be a number";
  } else if (Number(cleanedPrice) <= 0) {
    errors.price = "Price must be greater than 0";
  }

  if (!product.productImage.trim()) {
    errors.productImage = "Product image is required";
  }
  return errors;
};
