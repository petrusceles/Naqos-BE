const UserService = require("../services/user.services.js");

const loginSuccess = (req, res) => {
  console.log(req?.user);
  return res.status(200).json({
    status: "SUCCESS",
    message: "login success",
    data: {
      user: req?.session?.passport?.user,
    },
  });
};

const loginFailed = (req, res) => {
  return res.status(401).json({
    status: "UNAUTHORIZED",
    message: req.session.messages,
    data: null,
  });
};

const me = (req, res) => {
  return res.status(200).json({
    status: "SUCESS",
    message: "user data retrieved",
    data: req.session.passport.user,
  });
};

const logout = async (req, res) => {
  try {
    await req.logout((err) => {
      if (err) {
        return res.status(400).json({
          status: "BAD_REQUEST",
          message: err.message,
          data: null,
        });
      }
    });
    return res.status(200).json({
      status: "SUCCESS",
      message: "logged out",
      data: null,
    });
  } catch (err) {
    return res.status(500).json({
      status: "INTERNAL_SERVER_ERROR",
      message: err.message,
      data: null,
    });
  }
};
module.exports = {
  loginSuccess,
  loginFailed,
  logout,
  me,
};
