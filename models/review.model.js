const mongoose = require("mongoose");
const ReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "User",
    },
    kost: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "Kost",
    },
    star: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      validate: {
        validator: (value) => {
          return /^\d+$/.test(value);
        },
        message: "star value must be an integer number",
      },
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
