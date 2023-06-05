const User = require("../models/user.model.js");

const createUserRepo = async ({
  name,
  role,
  email,
  password,
  phone_number,
  is_verified,
}) => {
  const createdUser = await User.create({
    name,
    role,
    email,
    password,
    phone_number,
    is_verified,
  });
  return createdUser;
};

const findAllUsersRepo = async () => {
  const users = await User.find();
  return users;
};

const findUserByIdRepo = async ({ id }) => {
  const user = await User.findById(id);
  return user;
};

const updateUserByIdRepo = async ({
  id,
  name,
  role,
  email,
  password,
  phone_number,
  is_verified,
}) => {
  const updatedUser = await User.updateOne(
    { _id: id },
    { name, role, email, password, phone_number, is_verified }
  );
  return updatedUser;
};

const deleteUserByIdRepo = async ({ id }) => {
  const deletedUser = await User.deleteOne({
    _id: id,
  });
  return deletedUser;
};

module.exports = {
  createUserRepo,
  findAllUsersRepo,
  findUserByIdRepo,
  updateUserByIdRepo,
  deleteUserByIdRepo,
};
