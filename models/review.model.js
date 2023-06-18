const mongoose = require("mongoose");
const ReviewSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "Booking",
    },
    star: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      validate: {
        validator: (value) => {
          return /^\d+(\.\d{1})?$/.test(value);
        },
        message: "star value must be a number with up to one decimal place",
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
