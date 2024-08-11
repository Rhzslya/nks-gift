import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModels";

export const PUT = async (request: NextRequest) => {
  try {
    await connect();
    const { _id, updatedUser } = await request.json();

    // Pastikan _id dalam format string
    if (typeof _id !== "string") {
      throw new Error("Invalid ID format");
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
    console.error(error);
    return NextResponse.json(
      { status: false, statusCode: 500, message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
