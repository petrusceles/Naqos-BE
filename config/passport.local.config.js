const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const UserRepositories = require("../repositories/user.repositories.js");

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const users = await UserRepositories.findUsersByEmailRepo({ email });
        if (!users.length) {
          return done(null, false, { message: `no user with email ${email}` });
        }
        const isPasswordMatched = await bcrypt.compare(
          password,
          users[0].password
        );
        if (!isPasswordMatched) {
          return done(null, false, { message: "password incorrect" });
        }
        const user = users[0].toObject();
        delete user.password;
        user.role = user.role.name
        return done(null, user, { message: "login success" });
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (user, done) => {
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
