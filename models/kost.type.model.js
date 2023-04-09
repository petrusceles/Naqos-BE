const mongoose = require("mongoose");

const KostType = mongoose.model("KostType", {
  name: {
    type: String,
    required: true,
  },
  icon_url: {
    type: String,
    required: true,
  },
});

module.exports = KostType;
