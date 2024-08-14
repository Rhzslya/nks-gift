import mongoose from "mongoose";

const archivedUserSchema = new mongoose.Schema(
  {
    googleId: String,
    profileImage: String,
    userId: {
      type: Number,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: String,
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
      required: true,
    },
    archivedAt: {
      type: Date,
      default: Date.now,
    },

    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
  },
  { timestamps: true }
);

const ArchivedUser =
  mongoose.models.archived_users ||
  mongoose.model("archived_users", archivedUserSchema);

export default ArchivedUser;
