import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModels";
import { revalidatePath } from "next/cache";
export const GET = async (request: NextRequest, response: NextResponse) => {
  try {
    connect();
    // Fetch all users excluding certain fields
    const users = await User.find({}).select(
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
    console.error(error);
    return NextResponse.json(
      { status: false, statusCode: 500, message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
