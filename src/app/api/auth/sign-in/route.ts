import User from "@/models/userModels";
import bcryptjs from "bcryptjs";

export async function signIn(email: string, password: string) {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Email or Password is Wrong");
  }

  if (!user.isVerified) {
    throw new Error("Email not verified");
  }

  const validPassword = await bcryptjs.compare(password, user.password);

  if (!validPassword) {
    throw new Error("Email or Password is Wrong");
  }

  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
    isVerified: user.isVerified,
  };
}
