const KostTypeRepositories = require("../repositories/kost.type.repositories");
const CloudinaryUtils = require("../utils/cloudinary.utils.js");
const cloudinary = require("../config/cloudinary.js");
const createKostTypeService = async ({ name, icon }) => {
  try {
    if (!name || !icon) {
      return {
        status: "BAD_REQUEST",
        statusCode: 400,
        message: "name field must not be empty",
        data: {
          created_kost_type: null,
        },
      };
    }
    const isKostTypeExist = await KostTypeRepositories.findKostTypesByNameRepo({
      name,
    });
    if (isKostTypeExist.length) {
      return {
        status: "BAD_REQUEST",
        statusCode: 400,
        message: "kost type has already exist",
        data: {
          created_kost_type: null,
        },
      };
    }

    const iconUploadResponse = await CloudinaryUtils.uploadToCloudinary(
      icon,
      "KostType"
    );

    const newKostType = await KostTypeRepositories.createKostTypeRepo({
      name,
      icon_url: iconUploadResponse.secure_url,
    });

    return {
      status: "CREATED",
      statusCode: 201,
      message: "new kost type added",
      data: {
        created_kost_type: newKostType,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err.message,
      data: {
        created_kost_type: null,
      },
    };
  }
};

const findAllKostTypesService = async () => {
  try {
    const kostTypes = await KostTypeRepositories.findAllKostTypesRepo();
    if (!kostTypes.length) {
      return {
        status: "NOT_FOUND",
        statusCode: 404,
        message: "kost type is empty",
        data: {
          kost_types: null,
        },
      };
    }
    return {
      status: "FOUND",
      statusCode: 200,
      message: "all kost types retrieved",
      data: {
        kost_types: kostTypes,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err.message,
      data: {
        kost_types: null,
      },
    };
  }
};

const findKostTypeByIdService = async ({ id }) => {
  try {
    const kostType = await KostTypeRepositories.findKostTypeByIdRepo({ id });
    if (!kostType) {
      return {
        status: "NOT_FOUND",
        statusCode: 404,
        message: `no kost type with id ${id}`,
      };
    }
    return {
      status: "FOUND",
      statusCode: 200,
      message: "kost type retrieved",
      data: {
        kost_type: kostType,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err.message,
      data: {
        kost_type: null,
      },
    };
  }
};

const updateKostTypeByIdService = async ({ id, name, icon }) => {
  try {
    if (!name && !icon) {
      return {
        status: "BAD_REQUEST",
        statusCode: 400,
        message: `name or icon is needed`,
        data: {
          upodated_kost_type: null,
        },
      };
    }
    const kostType = await KostTypeRepositories.findKostTypeByIdRepo({ id });
    if (!kostType) {
      return {
        status: "NOT_FOUND",
        statusCode: 404,
        message: `no kost type with id ${id}`,
        data: {
          upodated_kost_type: null,
        },
      };
    }

    const isKostTypeNewNameExist =
      await KostTypeRepositories.findKostTypesByNameRepo({ name });
    if (isKostTypeNewNameExist.length) {
      return {
        status: "BAD_REQUEST",
        statusCode: 400,
        message: `kost type named ${name} is already exist`,
        data: {
          upodated_kost_type: null,
        },
      };
    }
    let iconUploadResponse;

    if (icon) {
      const oldIconPublidId = CloudinaryUtils.getPublicIdFromCloudinaryUrl(
        kostType.icon_url
      );
      cloudinary.uploader.destroy(oldIconPublidId);
      iconUploadResponse = await CloudinaryUtils.uploadToCloudinary(
        icon,
        "KostType"
      );
    }

    const updatedKostType = await KostTypeRepositories.updateKostTypeByIdRepo({
      id,
      name,
      icon_url: iconUploadResponse?.secure_url,
    });

    return {
      status: "SUCCESS",
      statusCode: 200,
      message: "kost type update",
      data: {
        kost_type: updatedKostType,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err.message,
      data: {
        upodated_kost_type: null,
      },
    };
  }
};

const deleteKostTypeByIdService = async ({ id }) => {
  try {
    const toBeDeletedKostType = await KostTypeRepositories.findKostTypeByIdRepo(
      { id }
    );
    if (!toBeDeletedKostType) {
      return {
        status: "NOT_FOUND",
        statusCode: 404,
        message: `no kost type with id ${id}`,
        data: {
          deleted_kost_type: null,
        },
      };
    }
    const iconPublicId = CloudinaryUtils.getPublicIdFromCloudinaryUrl(
      toBeDeletedKostType.icon_url
    );
    cloudinary.uploader.destroy(iconPublicId);
    const deletedKostType = await KostTypeRepositories.deleteKostTypeByIdRepo({
      id,
    });
    return {
      status: "SUCCESS",
      statusCode: 200,
      message: "kost type deleted",
      data: {
        deleted_kost_type: deletedKostType,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err.message,
      data: {
        deleted_kost_type: null,
      },
    };
  }
};

module.exports = {
  createKostTypeService,
  findAllKostTypesService,
  findKostTypeByIdService,
  updateKostTypeByIdService,
  deleteKostTypeByIdService,
};
