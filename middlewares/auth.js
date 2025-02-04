const checkAuthenticated = (req, res, next) => {
  console.log("req.user:", req.user); // Log the user object
  console.log("req.session:", req.session); // Log the session object
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      status: "UNAUTHORIZED",
      message: "unauthorized",
      data: null,
    });
  }
  next();
};

const checkNotAuthenticated = (req, res, next) => {
  // console.log("checkNotAuthenticated", req);
  if (req.isAuthenticated()) {
    return res.status(400).json({
      status: "BAD_REQUEST",
      message: "please logout first",
      data: null,
    });
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (req.session.passport.user.role != "admin") {
    return res.status(401).json({
      status: "UNAUTHORIZED",
      message: "unauthorized",
      data: null,
    });
  }
  next();
};

const isTenant = (req, res, next) => {
  if (req.session.passport.user.role != "tenant") {
    return res.status(401).json({
      status: "UNAUTHORIZED",
      message: "unauthorized",
      data: null,
    });
  }
  next();
};
const isBuyer = (req, res, next) => {
  if (req.session.passport.user.role != "buyer") {
    return res.status(401).json({
      status: "UNAUTHORIZED",
      message: "unauthorized",
      data: null,
    });
  }
  next();
};
module.exports = {
  checkNotAuthenticated,
  checkAuthenticated,
  isAdmin,
  isTenant,
  isBuyer,
};
