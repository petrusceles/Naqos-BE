const User = require("../models/user.model.js");

const createUserRepo = async ({
  name,
  role,
  email,
  password,
  phone_number,
  is_verified,
  avatar_url,
}) => {
  const createdUser = await User.create({
    name,
    role,
    email,
    password,
    phone_number,
    is_verified,
    avatar_url,
  });
  return createdUser;
};

const findAllUsersRepo = async () => {
  const users = await User.find().select("-password").populate("role");
  return users;
};

const findUserByIdRepo = async ({ id }) => {
  const user = await User.findById(id).select("-password").populate("role");
  return user;
};

const findUsersByNameRepo = async ({ name }) => {
  const users = await User.where("name").equals(name).populate("role");
  return users;
};

const findUsersByEmailRepo = async ({ email }) => {
  const users = await User.where("email")
    .equals(email)
    .populate("role");
  return users;
};

const findUsersByPhoneNumber = async ({ phone_number }) => {
  const users = await User.where("phone_number")
    .equals(phone_number)
    
    .populate("role");
  return users;
};

const updateUserByIdRepo = async ({
  id,
  name,
  role,
  email,
  password,
  phone_number,
  is_verified,
  avatar_url,
}) => {
  const updatedUser = await User.updateOne(
    { _id: id },
    { name, role, email, password, phone_number, is_verified, avatar_url }
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
  findUsersByNameRepo,
  findUsersByEmailRepo,
  findUsersByPhoneNumber,
};
