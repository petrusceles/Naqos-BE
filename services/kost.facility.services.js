const cloudinary = require("../config/cloudinary");
const KostFacilityRepositories = require("../repositories/kost.facility.repositories");

const uploadToCloudinary = (image) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      image,
      { folder: "KostFacility" },
      (err, url) => {
        if (err) return reject(err);
        return resolve(url);
      }
    );
  });
};

const getPublicIdFromCloudinaryUrl = (image_url) => {
  return image_url.match(/[^/]+\/[^/]+(?=\.png$)/)[0];
};

// const deleteImageFromCloudinary = (image_url) => {
//   return new Promise((resolve,reject)) => {
//     cloudinary.uploader.destroy()
//   }
// }

const createKostFacilityService = async ({ name, icon }) => {
  try {
    if (!name || !icon) {
      return {
        status: "BAD_REQUEST",
        statusCode: 400,
        message: "name or icon field must not be empty",
        data: {
          created_kost_type: null,
        },
      };
    }

    const isKostFacilityExist =
      await KostFacilityRepositories.findKostFacilitiesByNameRepo({ name });
    if (isKostFacilityExist.length) {
      return {
        status: "BAD_REQUEST",
        statusCode: 400,
        message: "kost type has already exist",
        data: {
          created_kost_type: null,
        },
      };
    }

    const iconUploadResponse = await uploadToCloudinary(icon);

    const newKostFacility =
      await KostFacilityRepositories.createKostFacilityRepo({
        name,
        icon_url: iconUploadResponse.url,
      });

    return {
      status: "CREATED",
      statusCode: 201,
      message: "new kost type added",
      data: {
        created_kost_type: newKostFacility,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err,
      data: {
        created_kost_type: null,
      },
    };
  }
};

const findAllKostFacilitiesService = async () => {
  try {
    const kostFacilities =
      await KostFacilityRepositories.findAllKostFacilitiesRepo();
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

const findKostFacilityByIdService = async ({ id }) => {
  try {
    const kostFacility =
      await KostFacilityRepositories.findKostFacilityByIdRepo({ id });
    if (!kostFacility) {
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
        kost_type: kostFacility,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err,
      data: {
        kost_type: null,
      },
    };
  }
};

const updateKostFacilityByIdService = async ({ id, name, icon }) => {
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
    const kostFacility =
      await KostFacilityRepositories.findKostFacilityByIdRepo({ id });
    if (!kostFacility) {
      return {
        status: "NOT_FOUND",
        statusCode: 404,
        message: `no kost type with id ${id}`,
        data: {
          upodated_kost_type: null,
        },
      };
    }

    const isKostFacilityNewNameExist =
      await KostFacilityRepositories.findKostFacilitiesByNameRepo({ name });
    if (isKostFacilityNewNameExist.length) {
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
      const oldIconPublidId = getPublicIdFromCloudinaryUrl(
        kostFacility.icon_url
      );
      cloudinary.uploader.destroy(oldIconPublidId);
      iconUploadResponse = await uploadToCloudinary(icon);
    }

    const updatedKostFacility =
      await KostFacilityRepositories.updateKostFacilityByIdRepo({
        id,
        name,
        icon_url: iconUploadResponse?.url,
      });

    return {
      status: "SUCCESS",
      statusCode: 200,
      message: "kost type update",
      data: {
        kost_type: updatedKostFacility,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err,
      data: {
        upodated_kost_type: null,
      },
    };
  }
};

const deleteKostFacilityByIdService = async ({ id }) => {
  try {
    const toBeDeletedKostFacility =
      await KostFacilityRepositories.findKostFacilityByIdRepo({ id });
    if (!toBeDeletedKostFacility) {
      return {
        status: "NOT_FOUND",
        statusCode: 404,
        message: `no kost type with id ${id}`,
        data: {
          deleted_kost_type: null,
        },
      };
    }
    const iconPublicId = getPublicIdFromCloudinaryUrl(
      toBeDeletedKostFacility.icon_url
    );
    cloudinary.uploader.destroy(iconPublicId);
    const deletedKostFacility =
      await KostFacilityRepositories.deleteKostFacilityByIdRepo({ id });
    return {
      status: "SUCCESS",
      statusCode: 200,
      message: "kost type deleted",
      data: {
        deleted_kost_type: deletedKostFacility,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err,
      data: {
        deleted_kost_type: null,
      },
    };
  }
};

module.exports = {
  createKostFacilityService,
  findAllKostFacilitiesService,
  findKostFacilityByIdService,
  updateKostFacilityByIdService,
  deleteKostFacilityByIdService,
};
