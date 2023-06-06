const UserRepositories = require("../repositories/user.repositories.js");
const RoleRepositories = require("../repositories/role.repositories.js");
const bcrypt = require("bcrypt");
const CloudinaryUtils = require("../utils/cloudinary.utils.js");
const cloudinary = require("../config/cloudinary.js");
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
    const hashedPassword = await bcrypt.hash(password, 11);
    const createdUser = await UserRepositories.createUserRepo({
      name,
      role: roleData[0],
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
    const user = await UserRepositories.findUserByIdRepo({ id });
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
    let updatedUser = await UserRepositories.findUserByIdRepo({ id });
    if (!updatedUser) {
      return {
        status: "NOT_FOUND",
        statusCode: 404,
        message: "user not found",
        data: {
          updated_user: null,
        },
      };
    }
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
        name: role,
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
      const hashedPassword = await bcrypt.hash(password, 11);
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
      const oldAvatarPublicId = CloudinaryUtils.getPublicIdFromCloudinaryUrl(
        updatedUser.avatar_url
      );
      const cloudinaryFolder = oldAvatarPublicId.split("/")[0];

      if (
        oldAvatarPublicId.split("/")[0] !=
        process.env.CLOUDINARY_BASIC_ASSET_FOLDER
      ) {
        cloudinary.uploader.destroy(oldAvatarPublicId);
      }
      
      const avatarUploadResponse = await CloudinaryUtils.uploadToCloudinary(
        avatar,
        "UserAvatar"
      );
      updatedUser.avatar_url = avatarUploadResponse?.secure_url;
    }

    await updatedUser.save();
    if (password) {
      updatedUser.password = "";
    }
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
        status: "NOT_FOUND",
        statusCode: 404,
        message: `user not found`,
        data: {
          deleted_user: null,
        },
      };
    }

    const userAvatarPublicId = CloudinaryUtils.getPublicIdFromCloudinaryUrl(
      user.avatar_url
    );
    if (
      userAvatarPublicId.split("/")[0] !=
      process.env.CLOUDINARY_BASIC_ASSET_FOLDER
    ) {
      cloudinary.uploader.destroy(userAvatarPublicId);
    }

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
