const mongoose = require("mongoose");
const BookingPhaseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const BookingPhase = mongoose.model("BookingPhase", BookingPhaseSchema);

module.exports = BookingPhase;
