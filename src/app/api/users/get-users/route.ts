import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModels";
import { revalidatePath } from "next/cache";
import jwt from "jsonwebtoken";

interface DecodedToken {
  role: string;
}

export const GET = async (request: NextRequest, response: NextResponse) => {
  try {
    connect();
    // Fetch all users excluding certain fields
    const allowedRoles = ["manager", "admin", "super_admin"];
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

    const users = await User.find({ deletedAt: null }).select(
      "-password -__v -googleId -updatedAt"
    );

    const path = request.nextUrl.searchParams.get("path") || "/";
    revalidatePath(path);
    const response = NextResponse.json({
      status: true,
      statusCode: 200,
      data: users,
    });

    response.headers.set("Cache-Control", "no-store, max-age=0");

    return response;
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
