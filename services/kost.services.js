const KostRepositories = require("../repositories/kost.repositories.js");
const KostTypeRepositories = require("../repositories/kost.type.repositories.js");
const KostFacilityRepositories = require("../repositories/kost.facility.repositories.js");
const RoomFacilityRepositories = require("../repositories/room.facility.repositories.js");
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
  outside_photos,
  inside_photos,
  bank,
  bank_number,
  room_facilities,
  room_total,
  room_remaining,
  day_price,
  month_price,
  year_price,
  room_photos,
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

    const isKostTypeExist = await KostTypeRepositories.findKostTypesByNameRepo({
      name: type,
    });
    if (!isKostTypeExist.length) {
      return {
        status: "BAD_REQUEST",
        statusCode: 400,
        message: `kost type unavailable`,
        data: {
          created_kost: null,
        },
      };
    }

    const kostFacilities =
      await KostFacilityRepositories.findKostFacilitiesByMultipleNameRepo({
        names: facilities,
      });

    if (kostFacilities?.length) {
      return {
        status: "BAD_REQUEST",
        statusCode: 400,
        message: `kost facilities should not be empty`,
        data: {
          created_kost: null,
        },
      };
    }

    let outsidePhotosUrl = [];
    for (let outsidePhoto of outside_photos) {
      const outsidePhotoResponse = await CloudinaryUtils.uploadToCloudinary(
        outsidePhoto,
        "KostOutsidePhotos"
      );
      outsidePhotosUrl.push(outsidePhotoResponse.secure_url);
    }

    if (outsidePhotosUrl?.length) {
      return {
        status: "BAD_REQUEST",
        statusCode: 400,
        message: `inside photos should not be empty`,
        data: {
          created_kost: null,
        },
      };
    }

    let insidePhotosUrl = [];
    for (let insidePhoto of inside_photos) {
      const insidePhotoResponse = await CloudinaryUtils.uploadToCloudinary(
        insidePhoto,
        "KostInsidePhotos"
      );
      insidePhotosUrl.push(insidePhotoResponse.secure_url);
    }

    if (insidePhotosUrl?.length) {
      return {
        status: "BAD_REQUEST",
        statusCode: 400,
        message: `inside photos should not be empty`,
        data: {
          created_kost: null,
        },
      };
    }

    const roomFacilities =
      await RoomFacilityRepositories.findRoomFacilitiesByMultipleNameRepo({
        names: facilities,
      });

    if (roomFacilities?.length) {
      return {
        status: "BAD_REQUEST",
        statusCode: 400,
        message: `kost facilities should not be empty`,
        data: {
          created_kost: kost,
        },
      };
    }

    let roomPhotosUrl = [];
    for (let roomPhoto of room_photos) {
      const roomPhotoResponse = await CloudinaryUtils.uploadToCloudinary(
        roomPhoto,
        "RoomPhotos"
      );
      roomPhotosUrl.push(roomPhotoResponse.secure_url);
    }

    if (roomPhotosUrl?.length) {
      return {
        status: "BAD_REQUEST",
        statusCode: 400,
        message: `room photos should not be empty`,
        data: {
          created_kost: null,
        },
      };
    }

    const kost = await KostRepositories.createKostRepo({
      name,
      user,
      address,
      province,
      district,
      subdistrict,
      type: isKostTypeExist[0],
      facilities: kostFacilities,
      regulations,
      bans,
      description,
      outside_photos_url: outsidePhotosUrl,
      inside_photos_url: insidePhotosUrl,
      bank,
      bank_number,
      room_facilities,
      room_total,
      room_remaining,
      day_price,
      month_price,
      year_price,
      room_photos_url: roomPhotosUrl,
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
  outside_photos,
  outside_photos_onhold_url,
  inside_photos,
  inside_photos_onhold_url,
  bank,
  bank_number,
  room_facilities,
  room_total,
  room_remaining,
  day_price,
  month_price,
  year_price,
  room_photos,
  room_photos_onhold_url,
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

    let newKostType;
    if (type) {
      let newKostTypeTemp = await KostTypeRepositories.findKostTypesByNameRepo({
        name: type,
      });
      if (!newKostType.length) {
        return {
          status: "BAD_REQUEST",
          statusCode: 400,
          message: "unavailable kost type",
          data: {
            updated_kost: null,
          },
        };
      }
      newKostType = newKostTypeTemp[0];
    }

    let newKostFacilities;
    if (facilities?.length && facilities != undefined) {
      newKostFacilities =
        await KostFacilityRepositories.findKostFacilitiesByMultipleNameRepo({
          names: facilities,
        });
      if (!newKostFacilities.length) {
        return {
          status: "BAD_REQUEST",
          statusCode: 400,
          message: "unavailable kost facilities",
          data: {
            updated_kost: null,
          },
        };
      }
    }

    let newRoomFacilities;
    if (room_facilities?.length && room_facilities != undefined) {
      newRoomFacilities =
        await RoomFacilityRepositories.findRoomFacilitiesByMultipleNameRepo({
          names: room_facilities,
        });
      if (!newRoomFacilities.length) {
        return {
          status: "BAD_REQUEST",
          statusCode: 400,
          message: "unavailable room facilities",
          data: {
            updated_kost: null,
          },
        };
      }
    }

    if (!Array.isArray(outside_photos_onhold_url)) {
      outside_photos_onhold_url = [outside_photos_onhold_url];
    }
    if (!Array.isArray(inside_photos_onhold_url)) {
      inside_photos_onhold_url = [inside_photos_onhold_url];
    }
    if (!Array.isArray(room_photos_onhold_url)) {
      room_photos_onhold_url = [room_photos_onhold_url];
    }

    let outsidePhotosCount = 0;

    if (outside_photos_onhold_url?.length) {
      outsidePhotosCount += outside_photos_onhold_url?.length;
    }
    if (outside_photos?.length) {
      outsidePhotosCount += outside_photos?.length;
    }

    let insidePhotosCount = 0;

    if (inside_photos_onhold_url?.length) {
      insidePhotosCount += inside_photos_onhold_url?.length;
    }
    if (inside_photos?.length) {
      insidePhotosCount += inside_photos?.length;
    }

    let roomPhotosCount = 0;

    if (room_photos_onhold_url?.length) {
      roomPhotosCount += room_photos_onhold_url?.length;
    }
    if (room_photos?.length) {
      roomPhotosCount += room_photos?.length;
    }

    if (
      outsidePhotosCount > 4 ||
      insidePhotosCount > 4 ||
      roomPhotosCount > 4
    ) {
      return {
        status: "BAD_REQUEST",
        statusCode: 400,
        message: "outside photos, inside photos, and room photos max 4",
        data: {
          updated_kost: null,
        },
      };
    }

    if (
      outsidePhotosCount == 0 ||
      insidePhotosCount == 0 ||
      roomPhotosCount == 0
    ) {
      return {
        status: "BAD_REQUEST",
        statusCode: 400,
        message:
          "outside photos, inside photos, and room photos should not be empty",
        data: {
          updated_kost: null,
        },
      };
    }

    if (outside_photos_onhold_url?.length) {
      KostUtils.deleteRemovedPhotosUrl({
        photosUrl: kostToUpdate.outside_photos_url,
        photosOnholdUrl: outside_photos_onhold_url,
      });
    }

    let outsidePhotosToUpload = outside_photos_onhold_url;

    if (outside_photos?.length) {
      for (const outsidePhoto of outside_photos) {
        const newOutsidePhotoResponse =
          await CloudinaryUtils.uploadToCloudinary(
            outsidePhoto,
            "KostOutsidePhotos"
          );
        outsidePhotosToUpload.push(newOutsidePhotoResponse.secure_url);
      }
    }

    if (inside_photos_onhold_url?.length) {
      KostUtils.deleteRemovedPhotosUrl({
        photosUrl: kostToUpdate.inside_photos_url,
        photosOnholdUrl: inside_photos_onhold_url,
      });
    }

    let insidePhotosToUpload = inside_photos_onhold_url;

    if (inside_photos) {
      for (const insidePhoto of inside_photos) {
        const newInsidePhotoResponse = await CloudinaryUtils.uploadToCloudinary(
          insidePhoto,
          "KostInsidePhotos"
        );
        insidePhotosToUpload.push(newInsidePhotoResponse.secure_url);
      }
    }

    if (room_photos_onhold_url?.length) {
      KostUtils.deleteRemovedPhotosUrl({
        photosUrl: kostToUpdate.room_photos_url,
        photosOnholdUrl: room_photos_onhold_url,
      });
    }

    let roomPhotosToUpload = room_photos_onhold_url;

    if (room_photos) {
      for (const roomPhoto of room_photos) {
        const newRoomPhotoResponse = await CloudinaryUtils.uploadToCloudinary(
          roomPhoto,
          "KostRoomPhotos"
        );
        roomPhotosToUpload.push(newRoomPhotoResponse.secure_url);
      }
    }

    const updatedKost = await KostRepositories.updateKostByIdRepo({
      id,
      name,
      address,
      province,
      district,
      subdistrict,
      type: newKostType,
      facilities: newKostFacilities,
      regulations,
      bans,
      description,
      outside_photos_url: outsidePhotosToUpload,
      inside_photos_url: insidePhotosToUpload,
      bank,
      bank_number,
      room_facilities: newRoomFacilities,
      room_total,
      room_remaining,
      day_price,
      month_price,
      year_price,
      room_photos_url: roomPhotosToUpload
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
    CloudinaryUtils.deleteAllImages(kostToDelete.inside_photos_url);
    CloudinaryUtils.deleteAllImages(kostToDelete.outside_photos_url);
    CloudinaryUtils.deleteAllImages(kostToDelete.room_photos_url);
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
