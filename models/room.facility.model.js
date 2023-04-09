const mongoose = require("mongoose");

const RoomFacility = mongoose.model("RoomFacility", {
  name: {
    type: String,
    required: true,
  },
  icon_url: {
    type: String,
    required: true,
  },
});

module.exports = RoomFacility;
