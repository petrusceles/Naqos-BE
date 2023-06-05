const mongoose = require("mongoose");
const RoomFacilitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    icon_url: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const RoomFacility = mongoose.model("RoomFacility", RoomFacilitySchema);

module.exports = RoomFacility;
