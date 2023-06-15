const RoomFacility = require("../models/room.facility.model");
const mongoose = require("mongoose");

const findRoomFacilitiesByNameRepo = async ({ name }) => {
  const roomFacility = await RoomFacility.where("name").equals(name).limit(1);
  return roomFacility;
};

const findRoomFacilityByIdRepo = async ({ id }) => {
  const roomFacility = await RoomFacility.findById(id);
  return roomFacility;
};

const findAllRoomFacilitiesRepo = async () => {
  const roomFacilities = await RoomFacility.find();
  return roomFacilities;
};

const findRoomFacilitiesByMultipleNameRepo = async ({ names }) => {
  const roomFacility = await RoomFacility.where("name").in(names);
  return roomFacility;
};

const createRoomFacilityRepo = async ({ name, icon_url }) => {
  const newRoomFacility = await RoomFacility.create({
    name,
    icon_url,
  });
  return newRoomFacility;
};

const updateRoomFacilityByIdRepo = async ({ id, name, icon_url }) => {
  const updatedRoomFacility = await RoomFacility.updateOne(
    { _id: id },
    { $set: { name: name, icon_url: icon_url } }
  );
  return updatedRoomFacility;
};

const deleteRoomFacilityByIdRepo = async ({ id }) => {
  const deletedRoomFacility = await RoomFacility.deleteOne({ _id: id });
  return deletedRoomFacility;
};

module.exports = {
  findRoomFacilitiesByNameRepo,
  findAllRoomFacilitiesRepo,
  createRoomFacilityRepo,
  updateRoomFacilityByIdRepo,
  deleteRoomFacilityByIdRepo,
  findRoomFacilityByIdRepo,
  findRoomFacilitiesByMultipleNameRepo,
};
