const mongoose = require("mongoose");
const ReviewSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "User",
    },
    room_id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "Room",
    },
    star: {
      type: Float32Array,
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;
