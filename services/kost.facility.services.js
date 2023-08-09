// const cloudinary = require("../config/cloudinary");
const KostFacilityRepositories = require("../repositories/kost.facility.repositories");
const CloudinaryUtils = require("../utils/cloudinary.utils.js");
const cloudinary = require("../config/cloudinary.js");
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

    const iconUploadResponse = await CloudinaryUtils.uploadToCloudinary(
      icon,
      "KostFacility"
    );

    const newKostFacility =
      await KostFacilityRepositories.createKostFacilityRepo({
        name,
        icon_url: iconUploadResponse.secure_url,
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
      message: err.message,
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
          kost_facilities: null,
        },
      };
    }
    return {
      status: "FOUND",
      statusCode: 200,
      message: "all kost facilities retrieved",
      data: {
        kost_facilities: kostFacilities,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err.message,
      data: {
        kost_facilities: null,
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
        data: {
          kost_type: null,
        },
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
      message: err.message,
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
      const oldIconPublidId = CloudinaryUtils.getPublicIdFromCloudinaryUrl(
        kostFacility.icon_url
      );
      cloudinary.uploader.destroy(oldIconPublidId);
      iconUploadResponse = await CloudinaryUtils.uploadToCloudinary(
        icon,
        "KostFacility"
      );
    }
    const updatedKostFacility =
      await KostFacilityRepositories.updateKostFacilityByIdRepo({
        id,
        name,
        icon_url: iconUploadResponse?.secure_url,
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
      message: err.message,
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
    const iconPublicId = CloudinaryUtils.getPublicIdFromCloudinaryUrl(
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
      message: err.message,
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
