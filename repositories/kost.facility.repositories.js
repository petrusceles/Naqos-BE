const KostFacility = require("../models/kost.facility.model");
const mongoose = require("mongoose");

const findKostFacilityByName = async ({ name }) => {
  const kostFacility = await KostFacility.where("name").equals(name).limit(1);
  return kostFacility;
};

const findAllKostFacilities = async () => {
  const kostFacilities = await KostFacility.find();
  return kostFacilities;
};

const createKostFacility = async ({ name, icon_url }) => {
  const newKostFacility = await KostFacility.create({
    name,
    icon_url,
  });
  return newKostFacility;
};

const updateKostFacilityById = async ({ id, name, icon_url }) => {
  const updatedKostFacility = await KostFacility.updateOne(
    { _id: id },
    { $set: { name: name, icon_url: icon_url } }
  );
  return updatedKostFacility;
};

const deleteKostFacilityById = async ({ id }) => {
  const deletedKostFacility = await KostFacility.deleteOne({ _id: id });
  return deletedKostFacility;
};

module.exports = {
  findKostFacilityByName,
  findAllKostFacilities,
  createKostFacility,
  updateKostFacilityById,
  deleteKostFacilityById,
};
