import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModels";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

interface DecodedToken {
  role: string;
}

export const PATCH = async (request: NextRequest) => {
  try {
    await connect();

    const reqBody = await request.json();
    const { username, address, numberPhone, _id } = reqBody;
    const token = request.headers.get("authorization")?.split(" ")[1] || "";

    // Periksa token
    if (!token) {
      return NextResponse.json(
        { status: false, statusCode: 401, message: "No Token Provided" },
        { status: 401 }
      );
    }

    // Verifikasi token dan ambil informasi pengguna
    const decoded = await new Promise<DecodedToken>((resolve, reject) => {
      jwt.verify(token, process.env.TOKEN_SECRET || "", (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded as DecodedToken);
        }
      });
    });

    // Validasi ID
    if (typeof _id !== "string" || !mongoose.Types.ObjectId.isValid(_id)) {
      return NextResponse.json(
        { status: false, statusCode: 400, message: "Invalid ID format" },
        { status: 400 }
      );
    }

    // Update user di database
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { username, address, numberPhone },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Profile updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating profile", error },
      { status: 500 }
    );
  }
};
