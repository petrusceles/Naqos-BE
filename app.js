const mongoose = require("mongoose");
const express = require("express");
const app = express();

require("dotenv").config();

mongoose.connect(
  `mongodb+srv://naqosdb:${process.env.DB_PASSWORD}@naqosdb.ppdjsum.mongodb.net/?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true }
);

app.use(express.json());
app.listen(process.env.PORT || 2000, () => {
  console.log(`http://localhost:${process.env.PORT || 2000}`);
});
