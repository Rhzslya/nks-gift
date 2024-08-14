import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModels";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

interface DecodedToken {
  role: string;
}
export const PUT = async (request: NextRequest) => {
  try {
    await connect();

    // Daftar peran yang diizinkan
    const allowedRoles = ["manager", "admin", "super_admin"];
    const { _id, updatedUser } = await request.json();
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

    // Cek peran pengguna dari decoded token
    if (!allowedRoles.includes(decoded.role)) {
      return NextResponse.json(
        {
          status: false,
          statusCode: 403,
          message: "Forbidden: Insufficient Permissions",
        },
        { status: 403 }
      );
    }

    // Pastikan _id dalam format string
    // Validasi ID
    if (typeof _id !== "string" || !mongoose.Types.ObjectId.isValid(_id)) {
      return NextResponse.json(
        { status: false, statusCode: 400, message: "Invalid ID format" },
        { status: 400 }
      );
    }

    const user = await User.findByIdAndUpdate(_id, updatedUser, {
      new: true,
    }).select("-_id -password -__v -googleId -updatedAt");

    if (!user) {
      return NextResponse.json(
        { status: false, statusCode: 404, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: true,
      statusCode: 200,
      message: "User Update Succesfully",
      data: user, // Kembalikan data user yang telah diperbarui
    });
  } catch (error) {
    console.error("Error:", error);
    // Mengembalikan respons berdasarkan jenis kesalahan
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { status: false, statusCode: 403, message: "Access Denied" },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { status: false, statusCode: 500, message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
