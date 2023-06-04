const mongoose = require("mongoose");

const BookingPhase = mongoose.model("BookingPhase", {
  name: {
    type: String,
    required: true,
  },
});

module.exports = BookingPhase;
