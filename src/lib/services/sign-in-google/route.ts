import User from "@/models/userModels";

export async function handleGoogleSignIn(user: any, profile: any) {
  const existingUser = await User.findOne({ email: user.email });

  if (existingUser) {
    // Update existing user
    if (!existingUser.type?.includes("google")) {
      existingUser.type.push("google");
      existingUser.googleId = user.id;
      existingUser.profileImage = profile.picture;
      existingUser.isVerified = profile.email_verified;
      existingUser.username = existingUser.username || user.name;
    } else {
      // Set type to Google
      existingUser.googleId = user.id;
      existingUser.profileImage = profile.picture;
      existingUser.isVerified = profile.email_verified;
      existingUser.username = existingUser.username || user.name;
    }
    await existingUser.save();
    user.id = existingUser._id.toString();
    user.isAdmin = existingUser.isAdmin;
    user.type = existingUser.type;
    user.username = existingUser.username;
  } else {
    // Create new user
    const newUser = new User({
      email: user.email,
      username: user.name,
      googleId: user.id,
      profileImage: profile.picture,
      isAdmin: false,
      isVerified: profile.email_verified,
      type: ["google"], // Set type to Google
    });

    await newUser.save();
    user.id = newUser._id.toString();
    user.isAdmin = newUser.isAdmin;
    user.type = newUser.type;
  }

  return user;
}
