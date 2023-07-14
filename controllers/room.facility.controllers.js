const RoomFacilityServices = require("../services/room.facility.services");

const createRoomFacility = async (req, res) => {
  const { name } = req.body;
  const icon = req.fileEncoded;
  const { status, statusCode, message, data } =
    await RoomFacilityServices.createRoomFacilityService({ name, icon });
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

const findAllRoomFacilities = async (req, res) => {
  const { status, statusCode, message, data } =
    await RoomFacilityServices.findAllRoomFacilitiesService();
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

const findRoomFacilityById = async (req, res) => {
  const id = req.params.id;
  const { status, statusCode, message, data } =
    await RoomFacilityServices.findRoomFacilityByIdService({ id });
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

const updateRoomFacilityById = async (req, res) => {
  const { name } = req.body;
  const id = req.params.id;
  const icon = req.fileEncoded;
  const { status, statusCode, message, data } =
    await RoomFacilityServices.updateRoomFacilityByIdService({
      id,
      name,
      icon,
    });
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

const deleteRoomFacilityById = async (req, res) => {
  const id = req.params.id;
  const { status, statusCode, message, data } =
    await RoomFacilityServices.deleteRoomFacilityByIdService({ id });
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

module.exports = {
  createRoomFacility,
  findAllRoomFacilities,
  findRoomFacilityById,
  updateRoomFacilityById,
  deleteRoomFacilityById,
};
