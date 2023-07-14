const KostFacility = require("../models/kost.facility.model");
const mongoose = require("mongoose");

const findKostFacilitiesByNameRepo = async ({ name }) => {
  const kostFacility = await KostFacility.where("name").equals(name).limit(1);
  return kostFacility;
};

const findKostFacilitiesByMultipleNameRepo = async ({ names }) => {
  const kostFacility = await KostFacility.where("name").in(names);
  return kostFacility;
};

const findKostFacilityByIdRepo = async ({ id }) => {
  const kostFacility = await KostFacility.findById(id);
  return kostFacility;
};

const findAllKostFacilitiesRepo = async () => {
  const kostFacilities = await KostFacility.find();
  return kostFacilities;
};

const createKostFacilityRepo = async ({ name, icon_url }) => {
  const newKostFacility = await KostFacility.create({
    name,
    icon_url,
  });
  return newKostFacility;
};

const updateKostFacilityByIdRepo = async ({ id, name, icon_url }) => {
  const updatedKostFacility = await KostFacility.updateOne(
    { _id: id },
    { $set: { name: name, icon_url: icon_url } }
  );
  return updatedKostFacility;
};

const deleteKostFacilityByIdRepo = async ({ id }) => {
  const deletedKostFacility = await KostFacility.deleteOne({ _id: id });
  return deletedKostFacility;
};

module.exports = {
  findKostFacilitiesByNameRepo,
  findAllKostFacilitiesRepo,
  createKostFacilityRepo,
  updateKostFacilityByIdRepo,
  deleteKostFacilityByIdRepo,
  findKostFacilityByIdRepo,
  findKostFacilitiesByMultipleNameRepo,
};
