const RoleServices = require("../services/role.services.js");

const createRole = async (req, res) => {
  const { name } = req.body;
  const { status, statusCode, message, data } =
    await RoleServices.createRoleService({ name });
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

const findAllRoles = async (req, res) => {
  const { status, statusCode, message, data } =
    await RoleServices.findAllRolesService();
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

const findRoleById = async (req, res) => {
  const id = req.params.id;
  const { status, statusCode, message, data } =
    await RoleServices.findRoleByIdService({ id });
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

const updateRoleById = async (req, res) => {
  const { name } = req.body;
  const id = req.params.id;
  const { status, statusCode, message, data } =
    await RoleServices.updateRoleByIdService({
      id,
      name,
    });
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

const deleteRoleById = async (req, res) => {
  const id = req.params.id;
  const { status, statusCode, message, data } =
    await RoleServices.deleteRoleByIdService({ id });
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

module.exports = {
  createRole,
  findAllRoles,
  findRoleById,
  updateRoleById,
  deleteRoleById,
};
