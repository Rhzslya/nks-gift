import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Product from "@/models/productsModels";
import jwt from "jsonwebtoken";
import { revalidatePath } from "next/cache";

interface DecodedToken {
  role: string;
}
const handler = async (request: NextRequest) => {
  if (request.method === "GET") {
    try {
      connect();
      // Fetch all products excluding certain fields
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

      const products = await Product.find();

      const path = request.nextUrl.searchParams.get("path") || "/";
      revalidatePath(path);
      const response = NextResponse.json({
        status: true,
        statusCode: 200,
        data: products,
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
  } else if (request.method === "POST") {
    try {
      connect();

      const allowedRoles = ["manager", "admin", "super_admin"];
      const token = request.headers.get("authorization")?.split(" ")[1] || "";

      const reqBody = await request.json();
      const { products } = reqBody;
      const stock = parseInt(products.stock);
      const price = parseInt(products.price);
      const category = products.category;

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

      // Ambil huruf pertama dari kategori untuk productId
      const categoryInitial = category.charAt(0).toUpperCase();

      // Cari produk terakhir berdasarkan productId yang dimulai dengan huruf kategori tersebut
      const lastProduct = await Product.findOne({ category })
        .sort({ productId: -1 }) // Mengurutkan secara descending berdasarkan productId
        .limit(1); // Ambil produk terakhir

      let newProductId;
      if (lastProduct) {
        // Ambil nomor urut dari produk terakhir dan tambahkan 1
        const lastProductId = lastProduct.productId;
        const lastNumber = parseInt(lastProductId.slice(1), 10); // Mengambil bagian nomor setelah huruf
        const newNumber = (lastNumber + 1).toString().padStart(3, "0"); // Membuat nomor baru dengan format tiga digit
        newProductId = `${categoryInitial}${newNumber}`; // Gabungkan huruf kategori dan nomor baru
      } else {
        // Jika tidak ada produk sebelumnya, mulai dari 001
        newProductId = `${categoryInitial}001`;
      }

      const newProduct = new Product({
        ...products,
        productId: newProductId,
        stock,
        price,
      });

      const savedProduct = await newProduct.save();

      return NextResponse.json({
        message: "Product created successfully",
        success: true,
        product: savedProduct,
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
  } else {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }
};

export { handler as GET, handler as POST };
