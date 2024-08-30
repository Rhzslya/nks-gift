import mongoose from "mongoose";
const AutoIncrement = require("mongoose-sequence")(mongoose);

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      require: true,
    },
    category: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
    },
    stock: {
      type: Number,
    },
  },
  { timestamps: true }
);
productSchema.plugin(AutoIncrement, { inc_field: "productId", unique: true });

productSchema.index({ productId: 1 }, { unique: true });

const Product =
  mongoose.models.products || mongoose.model("products", productSchema);

export default Product;
