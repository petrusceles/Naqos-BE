const KostRepositories = require("../repositories/kost.repositories.js");
const cloudinary = require("../config/cloudinary.js");
const CloudinaryUtils = require("../utils/cloudinary.utils.js");
const KostUtils = require("../utils/kost.utils.js");
const createKostService = async ({
  name,
  user,
  address,
  province,
  district,
  subdistrict,
  type,
  facilities,
  regulations,
  bans,
  description,
  questions,
  answers,
  outside_photos,
  inside_photos,
  bank,
  bank_number,
}) => {
  try {
    const isKostExist = await KostRepositories.findAllKostsByNameRepo({ name });
    if (isKostExist.length) {
      return {
        status: "BAD_REQUEST",
        statusCode: 400,
        message: `kost ${name} has already exists`,
        data: {
          created_kost: null,
        },
      };
    }

    let outsidePhotosUrl = [];
    for (let outsidePhoto in outside_photos) {
      const outsidePhotoResponse = await CloudinaryUtils.uploadToCloudinary(
        outsidePhoto,
        "KostOutsidePhotos"
      );
      outsidePhotosUrl.push(outsidePhotoResponse.secure_url);
    }

    let insidePhotosUrl = [];
    for (let insidePhoto in inside_photos) {
      const insidePhotoResponse = await CloudinaryUtils.uploadToCloudinary(
        insidePhoto,
        "KostInsidePhotos"
      );
      insidePhotosUrl.push(insidePhotoResponse.secure_url);
    }

    const kost = await KostRepositories.createKostRepo({
      name,
      user,
      address,
      province,
      district,
      subdistrict,
      type,
      facilities,
      regulations,
      bans,
      description,
      questions,
      answers,
      outsides_photos_url: outsidePhotosUrl,
      inside_photos_url: insidePhotosUrl,
      bank,
      bank_number,
    });
    return {
      status: "SUCCESS",
      statusCode: 201,
      message: `kost ${name} successfully created`,
      data: {
        created_kost: kost,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err,
      data: {
        created_kost: null,
      },
    };
  }
};

const searchAllKostsByKeywordService = async ({ keyword }) => {
  try {
    const kosts = await KostRepositories.searchAllKostsByKeywordRepo({
      keyword,
    });
    if (!kosts.length) {
      return {
        status: "NOT_FOUND",
        statusCode: 404,
        message: "kosts not found",
        data: {
          kosts: null,
        },
      };
    }

    return {
      status: "SUCCESS",
      statusCode: 200,
      message: "kost retrieved",
      data: {
        kosts: kosts,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err,
      data: {
        kosts: null,
      },
    };
  }
};

const findKostByIdService = async ({ id }) => {
  try {
    const kost = await KostRepositories.findKostByIdRepo({ id });
    if (!kost) {
      return {
        status: "NOT_FOUND",
        statusCode: 404,
        message: `no kost with id ${id}`,
        data: {
          kost: null,
        },
      };
    }
    return {
      status: "SUCCESS",
      statusCode: 200,
      message: "kost retrieved",
      data: {
        kost: kost,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err,
      data: {
        kost: null,
      },
    };
  }
};

const updateKostByIdService = async ({
  id,
  user,
  name,
  address,
  province,
  district,
  subdistrict,
  type,
  facilities,
  regulations,
  bans,
  description,
  questions,
  answers,
  outside_photos,
  outside_photos_onhold_url,
  inside_photos,
  inside_photos_onhold_url,
  bank,
  bank_number,
}) => {
  try {
    const kostToUpdate = await KostRepositories.findKostByIdRepo({ id });

    if (!kostToUpdate) {
      return {
        status: "NOT_FOUND",
        statusCode: 404,
        message: "kost not found",
        data: {
          updated_kost: null,
        },
      };
    }

    if (kostToUpdate.user._id != user) {
      return {
        status: "UNAUTHORIZED",
        statusCode: 401,
        message: "kost not owned by corresponding user",
        data: {
          updated_kost: null,
        },
      };
    }

    KostUtils.deleteRemovedPhotosUrl({
      outsidePhotosUrl: kostToUpdate.outside_photos_url,
      outsidePhotosOnholdUrl: outside_photos_onhold_url,
    });

    let outsidePhotosToUpload = outside_photos_onhold_url;

    if (outside_photos) {
      for (const outsidePhoto in outside_photos) {
        const newOutsidePhotoResponse =
          await CloudinaryUtils.uploadToCloudinary(
            outsidePhoto,
            "KostOutsidePhotos"
          );
        outsidePhotosToUpload.push(newOutsidePhotoResponse.secure_url);
      }
    }

    KostUtils.deleteRemovedPhotosUrl({
      outsidePhotosUrl: kostToUpdate.inside_photos_url,
      outsidePhotosOnholdUrl: inside_photos_onhold_url,
    });

    let insidePhotosToUpload = inside_photos_onhold_url;

    if (inside_photos) {
      for (const insidePhoto in inside_photos) {
        const newInsidePhotoResponse = await CloudinaryUtils.uploadToCloudinary(
          insidePhoto,
          "KostInsidePhotos"
        );
        insidePhotosToUpload.push(newInsidePhotoResponse.secure_url);
      }
    }

    const updatedKost = await KostRepositories.updateKostByIdRepo({
      id,
      name,
      address,
      province,
      district,
      subdistrict,
      type,
      facilities,
      regulations,
      bans,
      description,
      questions,
      answers,
      outside_photos_url: outsidePhotosToUpload,
      inside_photos_url: insidePhotosToUpload,
      bank,
      bank_number,
    });
    return {
      status: "SUCCESS",
      statusCode: 200,
      message: "kost updated",
      data: {
        updated_kost: updatedKost,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err,
      data: {
        updated_kost: null,
      },
    };
  }
};

const deleteKostByIdService = async ({ id, user }) => {
  try {
    const kostToDelete = await KostRepositories.findKostByIdRepo({ id });
    if (!kostToDelete) {
      return {
        status: "NOT_FOUND",
        statusCode: 404,
        message: "kost not found",
        data: {
          deleted_kost: null,
        },
      };
    }

    if (kostToDelete.user._id != user) {
      return {
        status: "UNAUTHORIZED",
        statusCode: 401,
        message: "kost not owned by corresponding user",
        data: {
          updated_kost: null,
        },
      };
    }
    const deletedKost = await KostRepositories.deleteKostByIdRepo({ id });

    return {
      status: "SUCCESS",
      statusCode: 200,
      message: "kost deleted",
      data: {
        deleted_kost: deletedKost,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err,
      data: {
        deleted_kost: null,
      },
    };
  }
};

module.exports = {
  createKostService,
  findKostByIdService,
  searchAllKostsByKeywordService,
  updateKostByIdService,
  deleteKostByIdService,
};
