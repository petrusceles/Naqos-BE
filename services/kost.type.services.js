const cloudinary = require("../config/cloudinary");
const KostTypeRepositories = require("../repositories/kost.type.repositories");

const uploadToCloudinary = (image) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(image, { folder: "KostType" }, (err, url) => {
      if (err) return reject(err);
      return resolve(url);
    });
  });
};

const getPublicIdFromCloudinaryUrl = (image_url) => {
  return image_url.match(/[^/]+\/[^/]+(?=\.svg$)/)[0];
};

const createKostTypeService = async ({ name, icon }) => {
  try {
    if (!name || !icon) {
      return {
        status: "BAD_REQUEST",
        statusCode: 400,
        message: "name field must not be empty",
        data: {
          created_kost_facility: null,
        },
      };
    }

    const isKostTypeExist =
      await KostTypeRepositories.findKostFacilitiesByNameRepo({ name });
    if (isKostTypeExist.length) {
      return {
        status: "BAD_REQUEST",
        statusCode: 400,
        message: "kost facility has already exist",
        data: {
          created_kost_facility: null,
        },
      };
    }

    const iconUploadResponse = await uploadToCloudinary(icon);

    const newKostType = await KostTypeRepositories.createKostTypeRepo({
      name,
      icon_url: iconUploadResponse.secure_url,
    });

    return {
      status: "CREATED",
      statusCode: 201,
      message: "new kost facility added",
      data: {
        created_kost_facility: newKostType,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err,
      data: {
        created_kost_facility: null,
      },
    };
  }
};

const findAllKostFacilitiesService = async () => {
  try {
    const kostFacilities =
      await KostTypeRepositories.findAllKostFacilitiesRepo();
    if (!kostFacilities.length) {
      return {
        status: "NOT_FOUND",
        statusCode: 404,
        message: "kost facility is empty",
        data: {
          kost_facilites: null,
        },
      };
    }
    return {
      status: "FOUND",
      statusCode: 200,
      message: "all kost facilities retrieved",
      data: {
        kost_facilites: kostFacilities,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err,
      data: {
        kost_facilites: null,
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
        message: `no kost facility with id ${id}`,
      };
    }
    return {
      status: "FOUND",
      statusCode: 200,
      message: "kost facility retrieved",
      data: {
        kost_facility: kostType,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err,
      data: {
        kost_facility: null,
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
          upodated_kost_facility: null,
        },
      };
    }
    const kostType = await KostTypeRepositories.findKostTypeByIdRepo({ id });
    if (!kostType) {
      return {
        status: "NOT_FOUND",
        statusCode: 404,
        message: `no kost facility with id ${id}`,
        data: {
          upodated_kost_facility: null,
        },
      };
    }

    const isKostTypeNewNameExist =
      await KostTypeRepositories.findKostFacilitiesByNameRepo({ name });
    if (isKostTypeNewNameExist.length) {
      return {
        status: "BAD_REQUEST",
        statusCode: 400,
        message: `kost facility named ${name} is already exist`,
        data: {
          upodated_kost_facility: null,
        },
      };
    }
    let iconUploadResponse;

    if (icon) {
      const oldIconPublidId = getPublicIdFromCloudinaryUrl(kostType.icon_url);
      cloudinary.uploader.destroy(oldIconPublidId);
      iconUploadResponse = await uploadToCloudinary(icon);
    }

    const updatedKostType = await KostTypeRepositories.updateKostTypeByIdRepo({
      id,
      name,
      icon_url: iconUploadResponse?.secure_url,
    });

    return {
      status: "SUCCESS",
      statusCode: 200,
      message: "kost facility update",
      data: {
        kost_facility: updatedKostType,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err,
      data: {
        upodated_kost_facility: null,
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
        message: `no kost facility with id ${id}`,
        data: {
          deleted_kost_facility: null,
        },
      };
    }
    const iconPublicId = getPublicIdFromCloudinaryUrl(
      toBeDeletedKostType.icon_url
    );
    cloudinary.uploader.destroy(iconPublicId);
    const deletedKostType = await KostTypeRepositories.deleteKostTypeByIdRepo({
      id,
    });
    return {
      status: "SUCCESS",
      statusCode: 200,
      message: "kost facility deleted",
      data: {
        deleted_kost_facility: deletedKostType,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err,
      data: {
        deleted_kost_facility: null,
      },
    };
  }
};

module.exports = {
  createKostTypeService,
  findAllKostFacilitiesService,
  findKostTypeByIdService,
  updateKostTypeByIdService,
  deleteKostTypeByIdService,
};
