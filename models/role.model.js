const mongoose = require("mongoose");

const Role = mongoose.model("Role", {
  name: {
    type: String,
    required: true,
  },
});

module.exports = Role;
