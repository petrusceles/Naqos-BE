const mongoose = require("mongoose");

const User = mongoose.model("User", {
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
});

module.exports = User;
