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
      role: roleData[0]._id,
      email,
      password: hashedPassword,
      phone_number,
      is_verified: false,
      avatar_url,
    });
    createdUser.password = "";
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
      message: err.message,
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
      message: err.message,
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
      message: err.message,
      data: {
        user: null,
      },
    };
  }
};

const updateUserPasswordByIdService = async ({
  id,
  password,
  old_password,
}) => {
  try {
    let currentUser = await UserRepositories.findUserByIdRepo({ id });
    if (!currentUser) {
      return {
        status: "NOT_FOUND",
        statusCode: 404,
        message: "user not found",
        data: {
          updated_user: null,
        },
      };
    }
    const isOldPasswordValid = await bcrypt.compare(
      old_password,
      currentUser.password
    );
    if (!isOldPasswordValid) {
      return {
        status: "BAD_REQUEST",
        statusCode: 401,
        message: "invalid password",
        data: {
          updated_user: null,
        },
      };
    }

    const newPasswordHashed = await bcrypt.hash(old_password, 11);
    const updatedUser = await UserRepositories.updateUserPasswordByIdRepo({
      id,
      password: newPasswordHashed,
    });
    return {
      status: "SUCCESS",
      statusCode: 200,
      message: "success update password",
      data: {
        updated_user: updatedUser,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err.message,
      data: {
        updated_user: null,
      },
    };
  }
};

const updateUserByIdService = async ({
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
}) => {
  try {
    let updatedUser = await UserRepositories.findUserWithPasswordByIdRepo({
      id,
    });
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
      if (users.filter((user) => user.name != updatedUser.name).length) {
        return {
          status: "BAD_REQUEST",
          statusCode: 400,
          message: "another user has used similar name",
          data: {
            updated_user: null,
          },
        };
      }
      if (name != updatedUser.name) updatedUser.name = name;
    }

    bank && (updatedUser.bank = bank);
    bank_name && (updatedUser.bank_name = bank_name);
    bank_number && (updatedUser.bank_number = bank_number);

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

      if (role != updatedUser?.role) updatedUser.role = isRoleAvailable[0];
    }
    if (is_verified !== undefined) {
      updatedUser.is_verified = is_verified;
    }

    if (email) {
      const isEmailOkay = await UserRepositories.findUsersByEmailRepo({
        email,
      });
      if (
        isEmailOkay.filter((user) => {
          return user.email !== updatedUser.email;
        }).length
      ) {
        return {
          status: "BAD_REQUEST",
          statusCode: 400,
          message: `email has been used by another user`,
          data: {
            updated_user: null,
          },
        };
      }
      let isEmailSimilar = false;
      for (const user of isEmailOkay) {
        if (user?.email === updatedUser?.email) {
          isEmailSimilar = true;
          break;
        }
      }
      if (!isEmailSimilar) {
        updatedUser.is_verified = false;
        updatedUser.email = email;
      }
    }

    if (phone_number) {
      const isPhoneNumberOkay = await UserRepositories.findUsersByPhoneNumber({
        phone_number,
      });
      if (
        isPhoneNumberOkay.filter(
          (user) => user.phone_number != updatedUser.phone_number
        ).length
      ) {
        return {
          status: "BAD_REQUEST",
          statusCode: 400,
          message: `phone number has been used by another user`,
          data: {
            updated_user: null,
          },
        };
      }

      let isPhoneNumberSimilar = false;
      for (const user of isPhoneNumberOkay) {
        if (user?.phone_number === updatedUser?.phone_number) {
          isPhoneNumberSimilar = true;
          break;
        }
      }
      if (!isPhoneNumberSimilar) {
        updatedUser.phone_number = phone_number;
      }
    }

    if (old_password && password) {
      const isOldPasswordValid = await bcrypt.compare(
        old_password,
        updatedUser.password
      );
      if (!isOldPasswordValid) {
        return {
          status: "BAD_REQUEST",
          statusCode: 401,
          message: "invalid password",
          data: {
            updated_user: null,
          },
        };
      }

      const newPasswordHashed = await bcrypt.hash(password, 11);
      updatedUser.password = newPasswordHashed;
    }

    if (avatar) {
      const oldAvatarPublicId = CloudinaryUtils.getPublicIdFromCloudinaryUrl(
        updatedUser.avatar_url
      );

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
    delete updatedUser.password;
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
      message: err.message,
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
      message: err.message,
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
  updateUserPasswordByIdService,
};
