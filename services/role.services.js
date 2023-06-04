const RoleRepositories = require("../repositories/role.repositories.js");

const createRoleService = async ({ name }) => {
  try {
    const isRoleExist = await RoleRepositories.findRolesByNameRepo({ name });

    if (isRoleExist.length) {
      return {
        status: "BAD_REQUEST",
        statusCode: 400,
        message: "role name has already exist",
        data: {
          created_role: null,
        },
      };
    }

    const newRole = await RoleRepositories.createRoleRepo({ name });
    return {
      status: "CREATED",
      statusCode: 201,
      message: "new role is succesfully created",
      data: {
        created_role: newRole,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err,
      data: {
        created_role: null,
      },
    };
  }
};

const findAllRolesService = async () => {
  try {
    const roles = await RoleRepositories.findAllRolesRepo();
    if (!roles.length) {
      return {
        status: "NOT_FOUND",
        statusCode: 404,
        message: "role is empty",
        data: {
          roles: null,
        },
      };
    }

    return {
      status: "FOUND",
      statusCode: 200,
      message: "all roles succesfully retrieved",
      data: {
        roles,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err,
      data: {
        roles: null,
      },
    };
  }
};

const findRoleByIdService = async ({ id }) => {
  try {
    const role = await RoleRepositories.findRoleByIdRepo({ id });
    if (!role) {
      return {
        status: "NOT_FOUND",
        statusCode: 404,
        message: "role is empty",
        data: {
          role: null,
        },
      };
    }
    return {
      status: "FOUND",
      statusCode: 200,
      message: "role found",
      data: {
        role,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err,
      data: {
        role: null,
      },
    };
  }
};

const updateRoleByIdService = async ({ id, name }) => {
  try {
    if (!name || !id) {
      return {
        status: BAD_REQUEST,
        statusCode: 400,
        message: "name and id are required",
        data: {
          updated_role: null,
        },
      };
    }
    const isRoleExist = await RoleRepositories.findRoleByIdRepo({ id });
    if (!isRoleExist) {
      return {
        status: "NOT_FOUND",
        statusCode: 404,
        message: `role with id ${id} doesn't exist`,
        data: {
          updated_role: null,
        },
      };
    }

    const isRoleNameExist = await RoleRepositories.findRolesByNameRepo({
      name,
    });
    if (isRoleNameExist.length) {
      return {
        status: "BAD_REQUEST",
        statusCode: 400,
        message: `role ${name} has already exist`,
        data: {
          updated_role: null,
        },
      };
    }

    const updatedRole = await RoleRepositories.updateRoleByIdRepo({ id, name });
    return {
      status: "SUCCESS",
      statusCode: 200,
      message: "role succesfully updated",
      data: {
        updated_role: updatedRole,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err,
      data: {
        role: null,
      },
    };
  }
};

const deleteRoleByIdService = async ({ id }) => {
  try {
    const isRoleExist = await RoleRepositories.findRoleByIdRepo({ id });
    if (!isRoleExist) {
      return {
        status: "NOT_FOUND",
        statusCode: 404,
        message: `role with id ${id} doesn't exist`,
        data: {
          deleted_role: null,
        },
      };
    }
    const deletedRole = await RoleRepositories.deleteRoleByIdRepo({ id });
    return {
      status: "SUCCESS",
      statusCode: 200,
      message: `role with id ${id} is succesfully deleted`,
      data: {
        deleted_role: deletedRole,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err,
      data: {
        role: null,
      },
    };
  }
};

module.exports = {
  createRoleService,
  findAllRolesService,
  findRoleByIdService,
  updateRoleByIdService,
  deleteRoleByIdService,
};
