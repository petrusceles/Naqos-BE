const mongoose = require("mongoose");
const KostSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      require: true,
      ref: "User",
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
    type: {
      type: mongoose.SchemaTypes.ObjectId,
      require: true,
      ref: "KostType",
    },
    facilities: {
      type: [mongoose.SchemaTypes.ObjectId],
      require: true,
      ref: "KostFacility",
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
    inside_photos_url: {
      type: [String],
      require: true,
    },
    bank: {
      type: String,
      require: true,
    },
    bank_number: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

KostSchema.index({
  name: "text",
  address: "text",
  province: "text",
  district: "text",
  subdistrict: "text",
  description: "text",
});
const Kost = mongoose.model("Kost", KostSchema);

module.exports = Kost;
