import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Product from "@/models/productsModels";
import jwt from "jsonwebtoken";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
interface DecodedToken {
  role: string;
}

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [];

const handler = async (request: NextRequest) => {
  const referer = request.headers.get("referer");
  const origin =
    request.headers.get("origin") ||
    (referer ? referer.split("/").slice(0, 3).join("/") : ""); // Ambil skema dan host

  if (!allowedOrigins.includes(origin)) {
    return NextResponse.json(
      {
        status: false,
        statusCode: 403,
        message: "Forbidden: Access from unknown origin",
      },
      { status: 403 }
    );
  }

  if (request.method === "GET") {
    try {
      connect();
      const allowedRoles = ["manager", "admin", "super_admin"];
      const searchQuery = request.nextUrl.searchParams.get("q") || "";
      const category = request.nextUrl.searchParams.get("category") || "";
      const id = request.nextUrl.searchParams.get("id") || "";
      const limit = parseInt(
        request.nextUrl.searchParams.get("limit") || "5",
        10
      );
      const page = parseInt(
        request.nextUrl.searchParams.get("page") || "1",
        10
      );

      if (
        isNaN(limit) ||
        limit <= 0 ||
        limit > 100 ||
        isNaN(page) ||
        page <= 0
      ) {
        return NextResponse.json(
          {
            status: false,
            statusCode: 400,
            message: "Invalid query parameters",
          },
          { status: 400 }
        );
      }

      const query: any = {};
      if (searchQuery) {
        query.productName = { $regex: `${searchQuery}`, $options: "i" };
      }
      if (category) {
        query.category = category;
      }
      if (id) {
        query.productId = id;
      }

      const skip = (page - 1) * limit;
      const products = await Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalProducts = await Product.countDocuments(query);
      return NextResponse.json({
        status: true,
        statusCode: 200,
        data: products,
        total: totalProducts,
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
      });
    } catch (error) {
      console.error("Error:", error);
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
      const categoryInitial = products.categoryInitial;

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

      const lastProduct = await Product.findOne({ category: products.category })
        .sort({ productId: -1 })
        .limit(1);

      let newProductId;
      if (lastProduct) {
        const lastProductId = lastProduct.productId;
        const lastNumber = parseInt(lastProductId.slice(1), 10); // Mengambil bagian nomor setelah huruf
        const newNumber = (lastNumber + 1).toString().padStart(3, "0"); // Membuat nomor baru dengan format tiga digit
        newProductId = `${categoryInitial}${newNumber}`; // Gabungkan huruf kategori dan nomor baru
      } else {
        newProductId = `${categoryInitial}001`;
      }

      const stock = products.stock.map(
        (item: { variant: string; quantity: string }) => ({
          variant: item.variant,
          quantity: parseInt(item.quantity), // Pastikan setiap kuantitas diparsing menjadi integer
        })
      );

      const newProduct = new Product({
        ...products,
        productId: newProductId,
        category: [products.category, "new-featured"],
        stock,
      });

      const savedProduct = await newProduct.save();

      const newFeaturedProducts = await Product.find({
        category: { $in: ["new-featured"] },
      })
        .sort({ createdAt: -1 })
        .lean();

      if (newFeaturedProducts.length > 10) {
        const oldestProduct = await Product.findOne({
          category: { $in: ["new-featured"] },
        }).sort({ createdAt: 1 });

        if (oldestProduct) {
          const updatedCategory = oldestProduct.category.filter(
            (cat: string) => cat !== "new-featured"
          );

          await Product.findByIdAndUpdate(oldestProduct._id, {
            category: updatedCategory,
          });
        }
      }

      return NextResponse.json({
        status: true,
        statusCode: 200,
        success: true,
        message: "Product created successfully",
        data: savedProduct,
      });
    } catch (error) {
      console.error("Error:", error);
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
  } else if (request.method === "PUT") {
    try {
      connect();
      const allowedRoles = ["manager", "admin", "super_admin"];
      const token = request.headers.get("authorization")?.split(" ")[1] || "";

      const reqBody = await request.json();
      const { _id, data } = reqBody;

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

      // Validasi ID
      if (!mongoose.Types.ObjectId.isValid(_id)) {
        return NextResponse.json(
          { status: false, message: "Invalid ID format" },
          { status: 400 }
        );
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        _id,
        { ...data }, // Update semua field di dalam data, termasuk productImage
        { new: true }
      );

      if (!updatedProduct) {
        return NextResponse.json(
          { status: false, message: "Product not found" },
          { status: 404 }
        );
      }

      // Mengembalikan hanya field yang diperlukan
      return NextResponse.json(
        {
          status: true,
          message: "Product updated successfully",
          data: updatedProduct,
        },
        { status: 200 }
      );
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
  } else if (request.method === "DELETE") {
    try {
      connect();

      // Daftar peran yang diizinkan
      const allowedRoles = ["manager", "admin", "super_admin"];
      const { _id } = await request.json();
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

      // Validasi ID
      if (typeof _id !== "string" || !mongoose.Types.ObjectId.isValid(_id)) {
        return NextResponse.json(
          { status: false, statusCode: 400, message: "Invalid ID format" },
          { status: 400 }
        );
      }

      //Temukan Product berdasarkan ID
      const product = await Product.findById(_id);
      if (!product) {
        return NextResponse.json(
          { status: false, statusCode: 404, message: "Product Not Found" },
          { status: 404 }
        );
      }

      //Hapus product dari koleksi Product
      await Product.findByIdAndDelete(_id);
      return NextResponse.json({
        status: true,
        statusCode: 200,
        message: "Product Deleted Succesfully",
        data: { _id: product._id },
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

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
