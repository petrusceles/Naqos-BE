const UserRepositories = require("../repositories/user.repositories.js");
const RoleRepositories = require("../repositories/role.repositories.js");
const bcrypt = require("bcrypt");

const createUserService = async ({
  name,
  role,
  email,
  password,
  phone_number,
}) => {
  try {
    const roleData = await RoleRepositories.findRolesByNameRepo({ name: role });
    if (!roleData.length) {
      return {
        status: "BAD_REQUEST",
        statusCode: 400,
        message: `role ${role} doesn't exist`,
        data: {
          created_user: null,
        },
      };
    }
    const hashedPassword = await bcrypt.hash(
      password,
      process.env.PASSWORD_SALT
    );

    const createdUser = await UserRepositories.createUserRepo({
      name,
      role: roleData,
      email,
      password: hashedPassword,
      phone_number,
      is_verified: false,
    });

    return {
      status: "SUCCESS",
      statusCode: 201,
      message: `user created`,
      data: {
        created_user: createdUser,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err,
      data: {
        created_user: null,
      },
    };
  }
};

const findAllUsersService = async () => {
  try {
    const users = await UserRepositories.findAllUsersRepo();
    if (!users.length) {
      return {
        status: "NOT_FOUND",
        statusCode: 404,
        message: `user is empty`,
        data: {
          users: null,
        },
      };
    }

    return {
      status: "SUCCESS",
      statusCode: 200,
      message: `all users retrieved`,
      data: {
        users,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err,
      data: {
        users: null,
      },
    };
  }
};

