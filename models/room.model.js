const mongoose = require("mongoose");
const RoomSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      require: true,
    },
    facilities: {
      type: [mongoose.SchemaTypes.ObjectId],
      require: true,
      ref: "RoomFacility",
    },
    room_total: {
      type: mongoose.SchemaTypes.Number,
      require: true,
    },
    room_remaining: {
      type: mongoose.SchemaTypes.Number,
      require: true,
    },
    day_price: {
      type: mongoose.SchemaTypes.Number,
      require: true,
    },
    month_price: {
      type: mongoose.SchemaTypes.Number,
      require: true,
    },
    year_price: {
      type: mongoose.SchemaTypes.Number,
      require: true,
    },
    room_photos_url: {
      type: [String],
      require: true,
    },
    kost: {
      type: mongoose.SchemaTypes.ObjectId,
      require: true,
      ref: "Kost",
    },
  },
  { timestamps: true }
);
const Room = mongoose.model("Room", RoomSchema);

module.exports = Room;
