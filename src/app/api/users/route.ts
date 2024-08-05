import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModels";

export async function GET() {
  await connect();

  try {
    // Ambil semua pengguna, kecualikan field password
    const users = await User.find({}).select(
      "-_id -password -__v -googleId -updatedAt"
    );
    return NextResponse.json({ status: true, statusCode: 200, data: users });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: false, statusCode: 500, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
