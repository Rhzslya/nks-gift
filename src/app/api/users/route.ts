import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModels";

connect();
export async function GET() {
  try {
    // Fetch all users excluding certain fields
    const users = await User.find({}).select(
      "-_id -password -__v -googleId -updatedAt"
    );

    const response = NextResponse.json({
      status: true,
      statusCode: 200,
      data: users,
    });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: false, statusCode: 500, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
