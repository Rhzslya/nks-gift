type User = {
  username: string;
  email: string;
  password: string;
  confirmpassword: string;
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

export const validationRegister = (user: User) => {
  const errors: Record<string, string> = {};

  const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,6}$/;

  if (!user.username) {
    errors.username = "Username is required";
  }

  if (!user.email) {
    errors.email = "Email is required";
  } else if (!email_pattern.test(user.email)) {
    errors.email = "Email is Invalid";
  }

  // Password validation
  if (!user.password) {
    errors.password = "Password is required";
  } else if (user.password.length < 8) {
    errors.password = "Password must be at least 8 characters long";
  } else if (!/[A-Z]/.test(user.password)) {
    errors.password = "Password must contain at least one uppercase letter";
  } else if (!/[a-z]/.test(user.password)) {
    errors.password = "Password must contain at least one lowercase letter";
  } else if (!/[0-9]/.test(user.password)) {
    errors.password = "Password must contain at least one number";
  } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(user.password)) {
    errors.password = "Password must contain at least one special character";
  }

  if (!user.confirmpassword) {
    errors.confirmpassword = "Confirm password is required";
  } else if (
    user.password &&
    user.confirmpassword &&
    user.password !== user.confirmpassword
  ) {
    errors.confirmpassword = "Passwords do not match";
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
