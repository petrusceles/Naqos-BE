const mongoose = require("mongoose");

require("dotenv").config();

mongoose.connect(
  `mongodb+srv://naqosdb:${process.env.DB_PASSWORD}@naqosdb.ppdjsum.mongodb.net/?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true }
);
