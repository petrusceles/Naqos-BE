const Kost = require("../models/kost.model.js");

const createKostRepo = async ({
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
  outsides_photos_url,
  inside_photos_url,
  bank,
  bank_number,
}) => {
  const kost = await Kost.create({
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
    outsides_photos_url,
    inside_photos_url,
    bank,
    bank_number,
  });

  return kost;
};

const findAllKostsRepo = async () => {
  const kost = await Kost.find();
  return kost;
};

const findAllKostsByNameRepo = async ({ name }) => {
  const kosts = await Kost.where("name")
    .equals(name)
    .populate({ path: "user", select: "-password" });
  return kosts;
};

const searchAllKostsByKeywordRepo = async ({ keyword }) => {
  const kosts = await Kost.find({ $text: { $search: keyword } }).populate({
    path: "user",
    select: "-password",
  });
  return kosts;
};

const findKostByIdRepo = async ({ id }) => {
  const kost = await Kost.findById(id).populate({
    path: "user",
    select: "-password",
  });
  return kost;
};

const updateKostByIdRepo = async ({
  id,
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
  outside_photos_url,
  inside_photos_url,
  bank,
  bank_number,
}) => {
  const updatedKost = await Kost.updateOne(
    {
      _id: id,
    },
    {
      $set: {
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
        outside_photos_url,
        inside_photos_url,
        bank,
        bank_number,
      },
    }
  );
  return updatedKost;
};

const deleteKostByIdRepo = async ({ id }) => {
  const deletedKost = Kost.deleteOne({ _id: id });
  return deletedKost;
};

module.exports = {
  createKostRepo,
  findAllKostsRepo,
  findKostByIdRepo,
  updateKostByIdRepo,
  deleteKostByIdRepo,
  searchAllKostsByKeywordRepo,
  findAllKostsByNameRepo,
};
