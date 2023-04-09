const mongoose = require("mongoose");

const Review = mongoose.model("Review", {
  user_id: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  room_id: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  star: {
    type: Float32Array,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
});

module.exports = Review;
