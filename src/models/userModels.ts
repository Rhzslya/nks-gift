import mongoose from "mongoose";
const AutoIncrement = require("mongoose-sequence")(mongoose);

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: false,
    },
    profileImage: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "user",
    },
    type: {
      type: [String],
      default: [],
      enum: ["credentials", "google", "facebook"],
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    numberPhone: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
  },
  { timestamps: true }
);

userSchema.plugin(AutoIncrement, { inc_field: "userId", unique: true });

userSchema.index({ userId: 1 }, { unique: true });

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;
