import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModels";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    await connect();
    const reqBody = await request.json();
    const { username, password } = reqBody;
    const email = reqBody.email.toLowerCase();

    // Check if email is already associated with a Google user
    const userGoogle = await User.findOne({
      email,
      googleId: { $exists: true },
      type: { $in: ["google"] },
    });

    if (userGoogle) {
      if (userGoogle.deletedAt !== null) {
        return NextResponse.json(
          {
            message:
              "Email already exists but has been previously deleted. Please contact support for assistance.",
          },
          { status: 400 }
        );
      }
      // Update the Google user with new credentials
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);
      userGoogle.username = username;
      userGoogle.password = hashedPassword;
      if (!userGoogle.type.includes("credentials")) {
        userGoogle.type.push("credentials");
      }
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
      if (user.deletedAt !== null) {
        return NextResponse.json(
          {
            message:
              "Email already exists but has been previously deleted. Please contact support for assistance.",
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

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
      user: savedUser,
    });
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
      error: error,
    });
  }
}
