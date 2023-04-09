const mongoose = require('mongoose');

const KostFacility = mongoose.model("KostFacility", {
  name: {
    type:String,
    required:true
  },
  icon_url: {
    type:String,
    required:true
  }
})

module.exports = KostFacility