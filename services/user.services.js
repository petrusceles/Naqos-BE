const UserRepositories = require("../repositories/user.repositories.js");
const RoleRepositories = require("../repositories/role.repositories.js");
const bcrypt = require("bcrypt");
const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (image) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(image, { folder: "UserAvatar" }, (err, url) => {
      if (err) return reject(err);
      return resolve(url);
    });
  });
};

const getPublicIdFromCloudinaryUrl = (image_url) => {
  return image_url.match(/[^/]+\/[^/]+(?=\.png$)/)[0];
};

const createUserService = async ({
  name,
  role,
  email,
  password,
  phone_number,
  avatar_url,
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
      avatar_url,
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

const findUserByIdService = async ({ id }) => {
  try {
    const user = await UserRepositories.findUserByIdService({ id });
    if (!user) {
      return {
        status: "NOT_FOUND",
        statusCode: 404,
        message: `no user with id ${id}`,
        data: {
          user: null,
        },
      };
    }
    return {
      status: "SUCCESS",
      statusCode: 200,
      message: "user found",
      data: {
        user,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err,
      data: {
        user: null,
      },
    };
  }
};

const updateUserByIdService = async ({
  id,
  name,
  role,
  email,
  password,
  phone_number,
  avatar,
}) => {
  try {
    const updatedUser = await UserRepositories.findUserByIdRepo({ id });

    if (name) {
      const users = await UserRepositories.findUsersByNameRepo({ name });

      if (users.length) {
        return {
          status: "BAD_REQUEST",
          statusCode: 400,
          message: "another user has used similar name",
          data: {
            updated_user: null,
          },
        };
      }

      updatedUser.name = name;
    }

    if (role) {
      const isRoleAvailable = await RoleRepositories.findRolesByNameRepo({
        name,
      });
      if (!isRoleAvailable.length) {
        return {
          status: "BAD_REQUEST",
          statusCode: 400,
          message: `role ${role} doesn't exist`,
          data: {
            updated_user: null,
          },
        };
      }

      updatedUser.role = isRoleAvailable[0];
    }

    if (email) {
      const isEmailOkay = await UserRepositories.findUsersByEmailRepo({
        email,
      });

      if (isEmailOkay.length) {
        return {
          status: "BAD_REQUEST",
          statusCode: 400,
          message: `email has been used by another user`,
          data: {
            updated_user: null,
          },
        };
      }

      updatedUser.email = email;
      updatedUser.is_verified = false;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(
        password,
        process.env.PASSWORD_SALT
      );
      updatedUser.password = hashedPassword;
    }

    if (phone_number) {
      const isPhoneNumberOkay = await UserRepositories.findUsersByPhoneNumber({
        phone_number,
      });
      if (isPhoneNumberOkay.length) {
        return {
          status: "BAD_REQUEST",
          statusCode: 400,
          message: `phone number has been used by another user`,
          data: {
            updated_user: null,
          },
        };
      }
      updatedUser.phone_number = phone_number;
    }

    if (avatar) {
      const avatarUploadResponse = await uploadToCloudinary(avatar);
      updatedUser.avatar_url = avatarUploadResponse?.secure_url;
    }

    await updatedUser.save();
    return {
      status: "SUCCESS",
      statusCode: 200,
      message: "user updated",
      data: {
        updated_user: updatedUser,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err,
      data: {
        updated_user: null,
      },
    };
  }
};

const deleteUserByIdService = async ({ id }) => {
  try {
    const user = await UserRepositories.findUserByIdRepo({ id });
    if (!user) {
      return {
        status: "BAD_REQUEST",
        statusCode: 400,
        message: `phone number has been used by another user`,
        data: {
          deleted_user: null,
        },
      };
    }

    const userAvatarPublicId = getPublicIdFromCloudinaryUrl(user.avatar_url);
    cloudinary.uploader.destroy(userAvatarPublicId);

    const deletedUser = await UserRepositories.deleteUserByIdRepo({ id });

    return {
      status: "SUCCESS",
      statusCode: 200,
      message: "user deleted",
      data: {
        deleted_user: deletedUser,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err,
      data: {
        deleted_user: null,
      },
    };
  }
};

module.exports = {
  createUserService,
  updateUserByIdService,
  findAllUsersService,
  findUserByIdService,
  deleteUserByIdService,
};
