import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import ArchivedUser from "@/models/archivedUser";
import { revalidatePath } from "next/cache";
export const GET = async (request: NextRequest, response: NextResponse) => {
  try {
    connect();
    // Fetch all users
    const users = await ArchivedUser.find({}).select(
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
