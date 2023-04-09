const express = require("express");
const app = express();
require('./config/db');

app.use(express.json());
app.listen(process.env.PORT || 2000, () => {
  console.log(`http://localhost:${process.env.PORT || 2000}`);
});
