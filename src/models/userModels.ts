import mongoose from "mongoose";
// Error Pending Register in fetch/XHR >>> Delete Plugin
const AutoIncrement = require("mongoose-sequence")(mongoose); // Hapus plugin ini sementara

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    require: false,
  },
  profileImage: {
    type: String,
    require: false,
  },
  username: {
    type: String,
    required: [true, "Please provide username"],
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
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
  isAdmin: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    require: false,
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
});

// Tambahkan plugin AutoIncrement ke skema jika versi mongoose-sequence terbaru mendukung
userSchema.plugin(AutoIncrement, { inc_field: "id" });

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;
