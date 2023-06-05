const mongoose = require("mongoose");
const KostTypeSchema = new mongoose.Schema(
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
const KostType = mongoose.model("KostType", KostTypeSchema);

module.exports = KostType;
