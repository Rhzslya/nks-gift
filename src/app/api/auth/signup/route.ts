import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModels";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

connect();

export async function POST(request: NextRequest) {
  //Defines an Asyncronus Function
  console.log("Received a Registration Request");

  try {
    //Get Data User From Body
    const reqBody = await request.json();
    const { username, email, password } = reqBody;
    console.log("Request Data From Body", reqBody);

    // Check Email if Already in Database
    const user = await User.findOne({ email });
    console.log("Checked Email in Database", user);

    // If User already in Database and User is Verified, return response 400
    if (user) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    } else {
      //hash password using bcryptjs.
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });

      // Saves the new user to the database.
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
