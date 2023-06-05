const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
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
    status_id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "BookingStatus",
    },
    prove_photo_url: {
      type: String,
      required: true,
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
