import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModels";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, password } = reqBody;
    const email = reqBody.email.toLowerCase();

    // Check if email is already used by a Google user
    const userGoogle = await User.findOne({
      email,
      googleId: { $exists: true },
      type: ["google"],
    });

    if (userGoogle) {
      // Update the user with new credentials
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);
      userGoogle.username = username;
      userGoogle.password = hashedPassword;
      userGoogle.type.push("credentials");
      await userGoogle.save();

      return NextResponse.json({
        message: "Account updated with new credentials",
        success: true,
        user: userGoogle,
      });
    }

    // Check if email is already in the database
    const user = await User.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
    });

    if (user) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    } else {
      // Hash password using bcryptjs
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        type: ["credentials"],
      });

      // Save the new user to the database
      const savedUser = await newUser.save();

      return NextResponse.json({
        message: "User created successfully",
        success: true,
        savedUser,
      });
    }
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
      error: error,
    });
  }
}
