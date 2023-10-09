const UserService = require("../services/user.services.js");

const createUser = async (req, res) => {
  const { name, role, email, password, phone_number, avatar_url } = req.body;

  const { status, statusCode, message, data } =
    await UserService.createUserService({
      name,
      role,
      email,
      password,
      phone_number,
      avatar_url,
    });
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

const findUserById = async (req, res) => {
  const id = req.params.id;
  const { status, statusCode, message, data } =
    await UserService.findUserByIdService({ id });
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

const findAllUser = async (req, res) => {
  const { status, statusCode, message, data } =
    await UserService.findAllUsersService();
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

const updateUserPasswordById = async (req, res) => {
  const id = req.session.passport.user.id;
  console.log(id);
  // const { status, statusCode, message, data } =
  //   await UserService.findAllUsersService();
  return res.status(statusCode);
};

const updateUserById = async (req, res) => {
  const id = req.params.id;
  const {
    name,
    role,
    email,
    phone_number,
    is_verified,
    password,
    old_password,
    bank,
    bank_number,
    bank_name,
  } = req.body;
  // console.log(req.body);
  const avatar = req.fileEncoded;
  const { status, statusCode, message, data } =
    await UserService.updateUserByIdService({
      id,
      name,
      role,
      email,
      phone_number,
      avatar,
      is_verified,
      password,
      old_password,
      bank,
      bank_number,
      bank_name,
    });

  console.log("BEFORE", req.session.passport.user);
  req.session.passport.user = data?.updated_user;
  console.log("AFTER", req.session.passport.user);
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

const deleteUserById = async (req, res) => {
  const id = req.params.id;
  const { status, statusCode, message, data } =
    await UserService.deleteUserByIdService({ id });
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

const userSendEmailVerif = async (req, res) => {
  const id = req.session.passport.user._id;
  const { verification_site } = req.body;

  const { status, statusCode, message } =
    await UserService.userSendEmailVerifService({ id, verification_site });
  return res.status(statusCode).json({
    status,
    message,
  });
};

const userVerifEmail = async (req, res) => {
  const { token, id } = req?.query;
  console.log(req?.query);
  const { status, statusCode, message, data } =
    await UserService.userVerifEmailService({ token, id });
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

module.exports = {
  createUser,
  findAllUser,
  findUserById,
  updateUserById,
  deleteUserById,
  updateUserPasswordById,
  userSendEmailVerif,
  userVerifEmail,
};
