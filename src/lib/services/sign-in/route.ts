import User from "@/models/userModels";
import bcryptjs from "bcryptjs";

export async function signIn(email: string, password: string) {
  // Pencarian case-insensitive dengan regex
  const user = await User.findOne({
    email: { $regex: new RegExp(`^${email}$`, "i") },
  });

  if (!user) {
    throw new Error("Email or password is incorrect. Please try again.");
  }

  if (!user.password) {
    throw new Error("Email or password is incorrect. Please try again.");
  }

  if (!user.isVerified) {
    throw new Error("Email is not verified.");
  }

  if (user.deletedAt !== null) {
    throw new Error(
      "Your account has been deactivated. Please contact support."
    );
  }

  const validPassword = await bcryptjs.compare(password, user.password);

  if (!validPassword) {
    throw new Error("Email or password is incorrect. Please try again.");
  }

  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
    type: user.type,
    address: user.address,
    numberPhone: user.numberPhone,
  };
}
