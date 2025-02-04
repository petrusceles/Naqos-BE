const express = require("express");
const app = express();
const routes = require("./routes");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const flash = require("express-flash");
const cors = require("cors");
var MongoDBStore = require("connect-mongodb-session")(session);

// const MongoStore = require("connect-mongo");

require("dotenv").config();
app.use(express.json());
app.set("trust proxy", 1);
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

require("./config/passport.local.config.js");
var store = new MongoDBStore({
  uri: process.env?.DB_URI,
  collection: "sessions",
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      secure: false,
      // sameSite: "none",
    },
    store: store,
  })
);
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use("/api", routes);

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    app.listen(process.env.PORT || 2000);
  })
  .catch((err) => {
    console.log(err);
  });
