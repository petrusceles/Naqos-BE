const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    role: {
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
      required: false,
    },
    phone_number: {
      type: String,
      required: false,
    },
    is_verified: {
      type: Boolean,
      required: true,
    },
    avatar_url: {
      type: String,
      require: false,
    },
  },
  { timestamps: true }
);
const User = mongoose.model("User", UserSchema);

module.exports = User;
