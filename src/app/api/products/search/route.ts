import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Product from "@/models/productsModels";

export async function GET(request: Request) {
  const searchQuery = new URL(request.url).searchParams.get("q") || "";

  console.log("Search Query:", searchQuery);

  try {
    await connect();

    const products = await Product.find(
      { productName: { $regex: searchQuery, $options: "i" } },
      { productName: 1, category: 1, productId: 1, _id: 0 }
    );

    return NextResponse.json({
      status: true,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching product names:", error);
    return NextResponse.json(
      {
        status: false,
        message: "Error fetching product names",
      },
      { status: 500 }
    );
  }
}
