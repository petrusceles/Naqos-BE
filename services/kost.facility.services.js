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

const createKostFacilityService = async ({ name, icon }) => {
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

    const isKostFacilityExist =
      await KostFacilityRepositories.findKostFacilityByName({ name });
    console.log(isKostFacilityExist);
    if (isKostFacilityExist.length) {
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

    const newKostFacility = await KostFacilityRepositories.createKostFacility({
      name,
      icon_url: iconUploadResponse.url,
    });

    return {
      status: "CREATED",
      statusCode: 201,
      message: "new kost facility added",
      data: {
        created_kost_facility: newKostFacility,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err,
      data: {
        created_car: null,
      },
    };
  }
};

const findAllKostFacilitiesService = async () => {
  try {
    const kostFacilities =
      await KostFacilityRepositories.findAllKostFacilities();
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
      statusCode: 201,
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
        created_car: null,
      },
    };
  }
};

module.exports = { createKostFacilityService, findAllKostFacilitiesService };
