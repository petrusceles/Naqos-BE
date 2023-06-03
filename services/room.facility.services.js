const cloudinary = require("../config/cloudinary");
const RoomFacilityRepositories = require("../repositories/room.facility.repositories");

const uploadToCloudinary = (image) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      image,
      { folder: "RoomFacility" },
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

const createRoomFacilityService = async ({ name, icon }) => {
  try {
    if (!name || !icon) {
      return {
        status: "BAD_REQUEST",
        statusCode: 400,
        message: "name or icon field must not be empty",
        data: {
          created_room_facility: null,
        },
      };
    }

    const isRoomFacilityExist =
      await RoomFacilityRepositories.findRoomFacilitiesByNameRepo({ name });
    if (isRoomFacilityExist.length) {
      return {
        status: "BAD_REQUEST",
        statusCode: 400,
        message: "room facility has already exist",
        data: {
          created_room_facility: null,
        },
      };
    }

    const iconUploadResponse = await uploadToCloudinary(icon);

    const newRoomFacility =
      await RoomFacilityRepositories.createRoomFacilityRepo({
        name,
        icon_url: iconUploadResponse.url,
      });

    return {
      status: "CREATED",
      statusCode: 201,
      message: "new room facility added",
      data: {
        created_room_facility: newRoomFacility,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err,
      data: {
        created_room_facility: null,
      },
    };
  }
};

const findAllRoomFacilitiesService = async () => {
  try {
    const roomFacilities =
      await RoomFacilityRepositories.findAllRoomFacilitiesRepo();
    if (!roomFacilities.length) {
      return {
        status: "NOT_FOUND",
        statusCode: 404,
        message: "room facility is empty",
        data: {
          room_facilites: null,
        },
      };
    }
    return {
      status: "FOUND",
      statusCode: 200,
      message: "all room facilities retrieved",
      data: {
        room_facilites: roomFacilities,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err,
      data: {
        room_facilites: null,
      },
    };
  }
};

const findRoomFacilityByIdService = async ({ id }) => {
  try {
    const roomFacility =
      await RoomFacilityRepositories.findRoomFacilityByIdRepo({ id });
    if (!roomFacility) {
      return {
        status: "NOT_FOUND",
        statusCode: 404,
        message: `no room facility with id ${id}`,
      };
    }
    return {
      status: "FOUND",
      statusCode: 200,
      message: "room facility retrieved",
      data: {
        room_facility: roomFacility,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err,
      data: {
        room_facility: null,
      },
    };
  }
};

const updateRoomFacilityByIdService = async ({ id, name, icon }) => {
  try {
    if (!name && !icon) {
      return {
        status: "BAD_REQUEST",
        statusCode: 400,
        message: `name or icon is needed`,
        data: {
          upodated_room_facility: null,
        },
      };
    }
    const roomFacility =
      await RoomFacilityRepositories.findRoomFacilityByIdRepo({ id });
    if (!roomFacility) {
      return {
        status: "NOT_FOUND",
        statusCode: 404,
        message: `no room facility with id ${id}`,
        data: {
          upodated_room_facility: null,
        },
      };
    }

    const isRoomFacilityNewNameExist =
      await RoomFacilityRepositories.findRoomFacilitiesByNameRepo({ name });
    if (isRoomFacilityNewNameExist.length) {
      return {
        status: "BAD_REQUEST",
        statusCode: 400,
        message: `room facility named ${name} is already exist`,
        data: {
          upodated_room_facility: null,
        },
      };
    }
    let iconUploadResponse;

    if (icon) {
      const oldIconPublidId = getPublicIdFromCloudinaryUrl(
        roomFacility.icon_url
      );
      cloudinary.uploader.destroy(oldIconPublidId);
      iconUploadResponse = await uploadToCloudinary(icon);
    }

    const updatedRoomFacility =
      await RoomFacilityRepositories.updateRoomFacilityByIdRepo({
        id,
        name,
        icon_url: iconUploadResponse?.url,
      });

    return {
      status: "SUCCESS",
      statusCode: 200,
      message: "room facility update",
      data: {
        room_facility: updatedRoomFacility,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err,
      data: {
        upodated_room_facility: null,
      },
    };
  }
};

const deleteRoomFacilityByIdService = async ({ id }) => {
  try {
    const toBeDeletedRoomFacility =
      await RoomFacilityRepositories.findRoomFacilityByIdRepo({ id });
    if (!toBeDeletedRoomFacility) {
      return {
        status: "NOT_FOUND",
        statusCode: 404,
        message: `no room facility with id ${id}`,
        data: {
          deleted_room_facility: null,
        },
      };
    }
    const iconPublicId = getPublicIdFromCloudinaryUrl(
      toBeDeletedRoomFacility.icon_url
    );
    cloudinary.uploader.destroy(iconPublicId);
    const deletedRoomFacility =
      await RoomFacilityRepositories.deleteRoomFacilityByIdRepo({ id });
    return {
      status: "SUCCESS",
      statusCode: 200,
      message: "room facility deleted",
      data: {
        deleted_room_facility: deletedRoomFacility,
      },
    };
  } catch (err) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: err,
      data: {
        deleted_room_facility: null,
      },
    };
  }
};

module.exports = {
  createRoomFacilityService,
  findAllRoomFacilitiesService,
  findRoomFacilityByIdService,
  updateRoomFacilityByIdService,
  deleteRoomFacilityByIdService,
};
