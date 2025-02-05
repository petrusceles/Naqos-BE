const express = require("express");
const routes = require("./routes");
const compression = require("compression");
const helmet = require("helmet");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const flash = require("express-flash");
const cors = require("cors");
var MongoDBStore = require("connect-mongodb-session")(session);

const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});

// const MongoStore = require("connect-mongo");

require("dotenv").config();
app.use(express.json());
app.use(compression());
app.use(limiter);
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  })
);
app.set("trust proxy", 1);
app.use(
  cors({
    origin: "https://naqos-fe.vercel.app",
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
      secure: true,
      sameSite: "none",
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
