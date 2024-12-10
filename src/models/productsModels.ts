import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    variant: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);
const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    productImage: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    category: {
      type: [String],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: [stockSchema],
  },
  { timestamps: true }
);

const Product =
  mongoose.models.products || mongoose.model("products", productSchema);

export default Product;
