const checkNotAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      status: "UNAUTHORIZED",
      message: "unauthorized",
      data: null,
    });
  }
  next();
};

const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.status(400).json({
      status: "BAD_REQUEST",
      message: "please logout first",
      data: null,
    });
  }
  next();
};
module.exports = {
  checkNotAuthenticated,
  checkAuthenticated,
};
