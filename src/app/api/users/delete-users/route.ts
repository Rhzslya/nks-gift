import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModels";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export const DELETE = async (request: NextRequest) => {
  try {
    await connect();
    const { _id } = await request.json();

    // Validasi ID
    if (typeof _id !== "string" || !mongoose.Types.ObjectId.isValid(_id)) {
      return NextResponse.json(
        { status: false, statusCode: 400, message: "Invalid ID format" },
        { status: 400 }
      );
    }

    const user = await User.findByIdAndDelete(_id);

    if (!user) {
      return NextResponse.json(
        { status: false, statusCode: 404, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: true,
      statusCode: 200,
      message: "User deleted successfully",
      data: { _id: user._id }, // Mengembalikan ID yang telah dihapus
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: false, statusCode: 500, message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
