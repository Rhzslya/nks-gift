import User from "@/models/userModels";
import bcryptjs from "bcryptjs";

export async function signIn(email: string, password: string) {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Email or password is incorrect. Please try again.");
  }

  if (!user.password) {
    throw new Error("Email or password is incorrect. Please try again.");
  }

  if (!user.isVerified) {
    throw new Error("Email is not verified.");
  }

  const validPassword = await bcryptjs.compare(password, user.password);
  console.log(email);
  console.log(password);
  console.log(user.type);
  if (!validPassword) {
    throw new Error("Email or password is incorrect. Please try again.");
  }

  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
    isVerified: user.isVerified,
    type: user.type,
  };
}
