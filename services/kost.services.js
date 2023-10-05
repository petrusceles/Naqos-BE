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
  kost_facilities,
  regulations,
  bans,
  description,
  outside_photos,
  inside_photos,
  room_facilities,
  room_total,
  room_remaining,
  week_price,
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

    const isKostTypeExist = await KostTypeRepositories.findKostTypeByIdRepo({
      id: type,
    });
    if (!isKostTypeExist) {
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
      await KostFacilityRepositories.findKostFacilitiesByMultipleIdRepo({
        ids: kost_facilities,
      });

    if (!kostFacilities?.length) {
      return {
        status: "BAD_REQUEST",
        statusCode: 400,
        message: `kost kost_facilities should not be empty`,
        data: {
          created_kost: null,
        },
      };
    }
    const roomFacilities =
      await RoomFacilityRepositories.findRoomFacilitiesByMultipleIdRepo({
        ids: room_facilities,
      });

    if (!roomFacilities?.length) {
      return {
        status: "BAD_REQUEST",
        statusCode: 400,
        message: `room facilities should not be empty`,
        data: {
          created_kost: null,
        },
      };
    }

    if (!Array.isArray(outside_photos) && outside_photos != undefined) {
      outside_photos = [outside_photos];
    }
    if (!Array.isArray(inside_photos) && inside_photos != undefined) {
      inside_photos = [inside_photos];
    }
    if (!Array.isArray(room_photos) && room_photos != undefined) {
      room_photos = [room_photos];
    }

    if (
      outside_photos?.length > 4 ||
      inside_photos?.length > 4 ||
      room_photos?.length > 4
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
      !outside_photos?.length ||
      !inside_photos?.length ||
      !room_photos?.length
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

    let outsidePhotosUrl = [];
    for (let outsidePhoto of outside_photos) {
      const outsidePhotoResponse = await CloudinaryUtils.uploadToCloudinary(
        outsidePhoto,
        "KostOutsidePhotos"
      );
      outsidePhotosUrl.push(outsidePhotoResponse.secure_url);
    }

    let insidePhotosUrl = [];
    for (let insidePhoto of inside_photos) {
      const insidePhotoResponse = await CloudinaryUtils.uploadToCloudinary(
        insidePhoto,
        "KostInsidePhotos"
      );
      insidePhotosUrl.push(insidePhotoResponse.secure_url);
    }

    let roomPhotosUrl = [];
    for (let roomPhoto of room_photos) {
      const roomPhotoResponse = await CloudinaryUtils.uploadToCloudinary(
        roomPhoto,
        "RoomPhotos"
      );
      roomPhotosUrl.push(roomPhotoResponse.secure_url);
    }

    const kost = await KostRepositories.createKostRepo({
      name,
      user,
      address,
      province,
      district,
      subdistrict,
      type: isKostTypeExist,
      kost_facilities: kostFacilities,
      regulations,
      bans,
      description,
      outside_photos_url: outsidePhotosUrl,
      inside_photos_url: insidePhotosUrl,
      room_facilities: roomFacilities,
      room_total,
      room_remaining,
      week_price,
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
      message: err.message,
      data: {
        created_kost: null,
      },
    };
  }
};

const searchAllKostsByKeywordService = async ({
  keyword,
  limit,
  sorted_by,
  search_by,
  sort,
  skip,
}) => {
  try {
    let keywordQuery = {};
    if (keyword) {
      keywordQuery.$text = { $search: `\"${keyword}\"` };
    }

    let query = {
      $and: [],
    };
    if (search_by) {
      query = Object.assign(query, keywordQuery, search_by);
    }
    delete query?.sort_price;
    for (const key in query) {
      if (Object.hasOwnProperty.call(query, key)) {
        switch (key) {
          case "kost_type":
            query["$and"] = [
              ...query?.$and,
              { type: { $in: query.kost_type } },
            ];

            delete query.kost_type;
            break;
          case "time": {
            for (const time of query?.time) {
              const timeQuery = `${time}_price`;
              query["$and"] = [
                ...query["$and"],
                { [timeQuery]: { $exists: true } },
              ];
              delete query.time;
            }
            break;
          }
          case "room_facility":
            query["$and"] = [
              ...query?.$and,
              { room_facilities: { $all: query.room_facility } },
            ];
            delete query.room_facility;
            break;

          case "kost_facility":
            query["$and"] = [
              ...query?.$and,
              { kost_facilities: { $all: query.kost_facility } },
            ];
            delete query.kost_facility;
            break;
          default:
            break;
        }
      }
    }
    console.log(query);
    delete query.is;

    if (!query.$and.length) {
      delete query.$and;
    }

    const kosts = await KostRepositories.searchAllKostsByKeywordRepo({
      query,
      limit,
      sorted_by,
      sort,
      skip,
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
    const kostTotal = await KostRepositories.findAllKostsCountRepo({ query });

    return {
      status: "SUCCESS",
      statusCode: 200,
      message: "kost retrieved",
      data: {
        kosts: kosts,
        next_skip: parseInt(skip) + parseInt(limit),
        next_limit: kostTotal,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err.message,
      data: {
        kosts: null,
      },
    };
  }
};

const findKostByIdService = async ({ id }) => {
  try {
    const kost = await KostRepositories.findKostByIdRepo({ id });
    // console.log(kost);
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
      message: err.message,
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
  kost_facilities,
  regulations,
  bans,
  description,
  outside_photos,
  outside_photos_onhold_url,
  inside_photos,
  inside_photos_onhold_url,
  room_facilities,
  room_total,
  room_remaining,
  week_price,
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
      let newKostTypeTemp = await KostTypeRepositories.findKostTypeByIdRepo({
        id: type,
      });
      if (!newKostTypeTemp) {
        return {
          status: "BAD_REQUEST",
          statusCode: 400,
          message: "unavailable kost type",
          data: {
            updated_kost: null,
          },
        };
      }
      newKostType = newKostTypeTemp;
    }

    let newKostFacilities;
    if (kost_facilities?.length && kost_facilities != undefined) {
      newKostFacilities =
        await KostFacilityRepositories.findKostFacilitiesByMultipleIdRepo({
          ids: kost_facilities,
        });
      if (!newKostFacilities.length) {
        return {
          status: "BAD_REQUEST",
          statusCode: 400,
          message: "unavailable kost kost_facilities",
          data: {
            updated_kost: null,
          },
        };
      }
    }

    let newRoomFacilities;
    if (room_facilities?.length && room_facilities != undefined) {
      newRoomFacilities =
        await RoomFacilityRepositories.findRoomFacilitiesByMultipleIdRepo({
          ids: room_facilities,
        });
      if (!newRoomFacilities.length) {
        return {
          status: "BAD_REQUEST",
          statusCode: 400,
          message: "unavailable room kost_facilities",
          data: {
            updated_kost: null,
          },
        };
      }
    }

    if (!Array.isArray(outside_photos)) {
      outside_photos = !outside_photos ? [] : [outside_photos];
    }
    if (!Array.isArray(inside_photos)) {
      inside_photos = !inside_photos ? [] : [inside_photos];
    }
    if (!Array.isArray(room_photos)) {
      room_photos = !room_photos ? [] : [room_photos];
    }

    if (!Array.isArray(outside_photos_onhold_url)) {
      outside_photos_onhold_url = !outside_photos_onhold_url
        ? []
        : [outside_photos_onhold_url];
    }
    if (!Array.isArray(inside_photos_onhold_url)) {
      inside_photos_onhold_url = !inside_photos_onhold_url
        ? []
        : [inside_photos_onhold_url];
    }
    if (!Array.isArray(room_photos_onhold_url)) {
      room_photos_onhold_url = !room_photos_onhold_url
        ? []
        : [room_photos_onhold_url];
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
          "RoomPhotos"
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
      kost_facilities: newKostFacilities,
      regulations,
      bans,
      description,
      outside_photos_url: outsidePhotosToUpload,
      inside_photos_url: insidePhotosToUpload,
      room_facilities: newRoomFacilities,
      room_total,
      room_remaining,
      week_price,
      month_price,
      year_price,
      room_photos_url: roomPhotosToUpload,
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
      message: err.message,
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
      message: err.message,
      data: {
        deleted_kost: null,
      },
    };
  }
};

const findAllCitiesService = async () => {
  try {
    const kostCities = await KostRepositories.findAllCitiesRepo();
    if (!kostCities) {
      return {
        status: "NOT_FOUND",
        statusCode: 404,
        message: "kost cities not found",
        data: {
          kost_cities: null,
        },
      };
    }
    return {
      status: "SUCCESS",
      statusCode: 200,
      message: "kost cities retrieved",
      data: {
        kost_cities: kostCities,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err.message,
      data: {
        kost_cities: null,
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
  findAllCitiesService,
};
