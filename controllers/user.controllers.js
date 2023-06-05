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

const updateUserById = async (req, res) => {
  const id = req.params.id;
  const { name, role, email, password, phone_number } = req.body;
  const avatar = req.fileEncoded;
  const { status, statusCode, message, data } =
    await UserService.updateUserByIdService({
      id,
      name,
      role,
      email,
      password,
      phone_number,
      avatar,
    });
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

module.exports = {
  createUser,
  findAllUser,
  findUserById,
  updateUserById,
  deleteUserById,
};