const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
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
    price: {
      type: Number,
      required: true,
    },
    time: {
      type: String,
      required: true,
      enum: {
        values: ["day", "month", "year"],
        message: "{VALUE} is not supported",
      },
    },
    phase: {
      type: String,
      required: true,
      enum: {
        values: ["booking", "payment", "confirmation", "failed"],
        message: "{VALUE} is not supported",
      },
    },
    proof_photo_url: {
      type: String,
    },
    in_date: {
      type: mongoose.SchemaTypes.Date,
      required: true,
    },
    out_date: {
      type: mongoose.SchemaTypes.Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", BookingSchema);

module.exports = Booking;
