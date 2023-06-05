const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user_name: {
      type: String,
      required: true,
    },
    front_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    role_id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "Role",
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    is_verified: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);
const User = mongoose.model("User", UserSchema);

module.exports = User;
