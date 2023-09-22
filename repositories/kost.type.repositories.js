const KostType = require("../models/kost.type.model.js");
const mongoose = require("mongoose");

const findKostTypesByNameRepo = async ({ name }) => {
  const kostType = await KostType.where("name").equals(name).limit(1);
  return kostType;
};

const findKostTypeByIdRepo = async ({ id }) => {
  console.log(id);
  const kostType = await KostType.findById(id);
  console.log(kostType);
  return kostType;
};

const findAllKostTypesRepo = async () => {
  const kostTypes = await KostType.find();
  return kostTypes;
};

const createKostTypeRepo = async ({ name, icon_url }) => {
  const newKostType = await KostType.create({
    name,
    icon_url,
  });
  return newKostType;
};

const updateKostTypeByIdRepo = async ({ id, name, icon_url }) => {
  const updatedKostType = await KostType.updateOne(
    { _id: id },
    { $set: { name: name, icon_url: icon_url } }
  );
  return updatedKostType;
};

const deleteKostTypeByIdRepo = async ({ id }) => {
  const deletedKostType = await KostType.deleteOne({ _id: id });
  return deletedKostType;
};

module.exports = {
  findKostTypesByNameRepo,
  findAllKostTypesRepo,
  createKostTypeRepo,
  updateKostTypeByIdRepo,
  deleteKostTypeByIdRepo,
  findKostTypeByIdRepo,
};
