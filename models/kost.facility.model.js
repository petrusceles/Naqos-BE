const mongoose = require("mongoose");
const KostFacilitySchema = new mongoose.Schema(
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
const KostFacility = mongoose.model("KostFacility", KostFacilitySchema);

module.exports = KostFacility;
