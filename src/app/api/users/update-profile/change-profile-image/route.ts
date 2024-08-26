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
      const { newImageURL, _id } = reqBody;
      const token = request.headers.get("authorization")?.split(" ")[1] || "";

      // Periksa token
      if (!token) {
        return NextResponse.json(
          { status: false, message: "No Token Provided" },
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
      }).catch((error) => {
        return NextResponse.json(
          { status: false, message: "Invalid or Expired Token" },
          { status: 401 }
        );
      });

      // Validasi ID
      if (!mongoose.Types.ObjectId.isValid(_id)) {
        return NextResponse.json(
          { status: false, message: "Invalid ID format" },
          { status: 400 }
        );
      }

      // Update user di database
      const updatedUser = await User.findByIdAndUpdate(
        _id,
        { profileImage: newImageURL },
        { new: true, select: "username profileImage" } // Hanya memilih field yang diperlukan
      );

      if (!updatedUser) {
        return NextResponse.json(
          { status: false, message: "User not found" },
          { status: 404 }
        );
      }

      // Mengembalikan hanya field yang diperlukan
      return NextResponse.json(
        {
          status: true,
          message: "Profile updated successfully",
          user: {
            username: updatedUser.username,
            profileImage: updatedUser.profileImage,
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
  } else if (request.method === "DELETE") {
  } else {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }
};

export { handler as PATCH, handler as DELETE };
