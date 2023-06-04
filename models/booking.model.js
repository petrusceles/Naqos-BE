const mongoose = require("mongoose");

const Booking = mongoose.model("Booking", {
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
});

module.exports = Booking;
