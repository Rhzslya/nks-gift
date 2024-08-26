import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModels";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

interface DecodedToken {
  role: string;
}

const handler = async (request: NextRequest) => {
  if (request.method === "PATCH") {
    try {
      await connect();

      const reqBody = await request.json();
      const { _id } = reqBody;
      const token = request.headers.get("authorization")?.split(" ")[1];

      if (!token) {
        return NextResponse.json(
          { status: false, message: "No Token Provided" },
          { status: 401 }
        );
      }

      const decoded = jwt.verify(
        token,
        process.env.TOKEN_SECRET || ""
      ) as DecodedToken;

      if (!mongoose.isValidObjectId(_id)) {
        return NextResponse.json(
          { status: false, message: "Invalid ID format" },
          { status: 400 }
        );
      }

      const user = await User.findById(_id);
      if (!user) {
        return NextResponse.json(
          { status: false, message: "User not found" },
          { status: 404 }
        );
      }

      if (user.profileImage === "") {
        return NextResponse.json(
          { status: false, message: "Your Picture Already Set As Default" },
          { status: 400 }
        );
      }

      user.profileImage = "";
      await user.save();

      return NextResponse.json(
        {
          status: true,
          message: "Profile Image Set As Default successfully",
          user: {
            username: user.username,
            profileImage: user.profileImage,
          },
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error updating profile:", error);
      return NextResponse.json(
        { message: "Error updating profile", error },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }
};

export { handler as PATCH };
