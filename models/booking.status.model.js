const mongoose = require("mongoose");

const BookingStatus = mongoose.model("BookingStatus", {
  name: {
    type: String,
    required: true,
  },
});

module.exports = BookingStatus;
