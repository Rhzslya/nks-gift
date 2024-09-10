import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    variant: {
      type: String,
      required: true, // Each variant is required
    },
    quantity: {
      type: Number,
      required: true, // Each quantity for a variant is required
      min: 0, // Ensure quantity is not negative
    },
  },
  { _id: false }
);
const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true, // Typo: should be "required" instead of "require"
    },
    productImage: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true, // Use auto-increment number for product ID
    },
    category: {
      type: String,
      required: true, // Typo: should be "required" instead of "require"
    },
    price: {
      type: Number,
      required: true, // To ensure price is provided
    },
    stock: [stockSchema],
  },
  { timestamps: true }
);

const Product =
  mongoose.models.products || mongoose.model("products", productSchema);

export default Product;
