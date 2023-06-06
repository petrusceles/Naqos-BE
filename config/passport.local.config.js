const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const UserRepositories = require("../repositories/user.repositories.js");

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await UserRepositories.findUsersByEmailRepo({ email });
        if (!user.length) {
          return done(null, false, { message: `no user with email ${email}` });
        }
        const isPasswordMatched = await bcrypt.compare(
          password,
          user[0].password
        );
        if (!isPasswordMatched) {
          return done(null, false, { message: "password incorrect" });
        }
        return done(null, user[0], { message: "login success" });
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (req, user, done) => {
  try {
    const isUserExist = await UserRepositories.findUserByIdRepo({
      id: user._id,
    });
    if (!isUserExist) {
      return done(null, false);
    }
    return done(null, isUserExist);
  } catch (err) {
    return done(null, false);
  }
});

module.exports = passport;
