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
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
  },
  { timestamps: true }
);

userSchema.plugin(AutoIncrement, { inc_field: "userId" });

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;
