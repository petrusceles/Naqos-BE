const Role = require("../models/role.model.js");

const findRoleByIdRepo = async ({ id }) => {
  const role = await Role.findById(id);
  return role;
};

const findRolesByNameRepo = async ({ name }) => {
  const roles = await Role.where("name").equals(name).limit(1);
  return roles;
};

const findAllRolesRepo = async () => {
  const roles = await Role.find();
  return roles;
};

const createRoleRepo = async ({ name }) => {
  const newRole = await Role.create({ name });
  return newRole;
};

const updateRoleByIdRepo = async ({ id, name }) => {
  const updatedRole = await Role.updateOne(
    {
      _id: id,
    },
    { $set: { name } }
  );
  return updatedRole;
};

const deleteRoleByIdRepo = async ({ id }) => {
  const deletedRole = await Role.deleteOne({
    _id: id,
  });
  return deletedRole;
};

module.exports = {
  findAllRolesRepo,
  findRoleByIdRepo,
  updateRoleByIdRepo,
  createRoleRepo,
  deleteRoleByIdRepo,
  findRolesByNameRepo,
};
