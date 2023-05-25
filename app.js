const express = require("express");
const app = express();
require("./config/db");
const routes = require("./routes");

app.use(express.json());
app.use("/api", routes);
app.listen(process.env.PORT || 2000, () => {
  console.log(`http://localhost:${process.env.PORT || 2000}`);
});
