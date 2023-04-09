const mongoose = require("mongoose");

const Kost = mongoose.model("Kost", {
  name: {
    type: String,
    require: true,
  },
  user_id: {
    type: mongoose.SchemaTypes.ObjectId,
    require: true,
  },
  address: {
    type: String,
    require: true,
  },
  province: {
    type: String,
    require: true,
  },
  district: {
    type: String,
    require: true,
  },
  subdistrict: {
    type: String,
    require: true,
  },
  type_id: {
    type: mongoose.SchemaTypes.ObjectId,
    require: true,
  },
  facilities_id: {
    type: [mongoose.SchemaTypes.ObjectId],
    require: true,
  },
  regulations: {
    type: [String],
    require: true,
  },
  bans: {
    type: [String],
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  questions: {
    type: [String],
    require: true,
  },
  answers: {
    type: [String],
    require: true,
  },
  outside_photos_url: {
    type: [String],
    require: true,
  },
});

module.exports = Kost;
