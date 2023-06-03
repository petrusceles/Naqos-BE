const express = require("express");
const app = express();
const routes = require("./routes");
const mongoose = require("mongoose");
require("dotenv").config();
app.use(express.json());
app.use("/api", routes);

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    app.listen(process.env.PORT || 2000, () => {
      console.log(`http://localhost:${process.env.PORT || 2000}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
