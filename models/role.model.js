const mongoose = require("mongoose");

const Role = mongoose.model("Role", {
  role_name: {
    type: String,
    required: true,
  },
});

module.exports = Role;
