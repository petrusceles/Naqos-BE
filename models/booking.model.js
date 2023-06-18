const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "User",
    },
    kost: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "Kost",
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
