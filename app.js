const express = require("express");
const app = express();
const routes = require("./routes");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const flash = require("express-flash");
const cors = require("cors");
const connectRedis = require("connect-redis");

require("dotenv").config();

app.use(express.json());
app.set("trust proxy", 1);
const redis = require("redis");
const RedisStore = connectRedis(session);
const redisClient = redis.createClient({
  host: "localhost",
  port: 6379,
});

redisClient.on("error", function (err) {
  console.log("Could not establish a connection with redis. " + err);
});
redisClient.on("connect", function (err) {
  console.log("Connected to redis successfully");
});
app.use(
  cors({
    origin: "https://naqos-fe.vercel.app",
    credentials: true,
  })
);

require("./config/passport.local.config.js");

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
    store: new RedisStore({ client: redisClient }),
  })
);
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

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
