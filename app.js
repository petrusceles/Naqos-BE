const express = require("express");
const app = express();
const routes = require("./routes");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const flash = require("express-flash");
const cors = require("cors");
// const connectRedis = require("connect-redis");

const redis = require("redis");
const RedisStore = require("connect-redis").default;

require("dotenv").config();
app.use(express.json());
app.set("trust proxy", 1);
const redisClient = redis.createClient();

redisClient.on("error", (err) => console.log("Redis Client Error", err));
await redisClient.connect();

let redisStore = new RedisStore({
  client: redisClient,
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
    store: redisStore,
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
