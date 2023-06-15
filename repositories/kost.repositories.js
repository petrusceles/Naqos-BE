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
  outside_photos_url,
  inside_photos_url,
  bank,
  bank_number,
  room_facilities,
  room_total,
  room_remaining,
  day_price,
  month_price,
  year_price,
  room_photos_url,
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
    outside_photos_url,
    inside_photos_url,
    bank,
    bank_number,
    room_facilities,
    room_total,
    room_remaining,
    day_price,
    month_price,
    year_price,
    room_photos_url,
  });

  return kost;
};

const findAllKostsRepo = async () => {
  const kost = await Kost.find()
    .populate({ path: "user", select: "-password" })
    .populate("facilities")
    .populate("type");
  return kost;
};

const findAllKostsByNameRepo = async ({ name }) => {
  const kosts = await Kost.where("name")
    .equals(name)
    .populate({ path: "user", select: "-password" })
    .populate("facilities")
    .populate("type");
  return kosts;
};

const searchAllKostsByKeywordRepo = async ({ keyword }) => {
  let query = {};
  if (keyword) {
    query.$text = { $search: keyword };
  }
  const kosts = await Kost.find(query)
    .populate({
      path: "user",
      select: "-password",
    })
    .populate("facilities")
    .populate("type");
  return kosts;
};

const findKostByIdRepo = async ({ id }) => {
  const kost = await Kost.findById(id)
    .populate({
      path: "user",
      select: "-password",
    })
    .populate("facilities")
    .populate("type");
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
  outside_photos_url,
  inside_photos_url,
  bank,
  bank_number,
  room_facilities,
  room_total,
  room_remaining,
  day_price,
  month_price,
  year_price,
  room_photos_url,
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
        outside_photos_url,
        inside_photos_url,
        bank,
        bank_number,
        room_facilities,
        room_total,
        room_remaining,
        day_price,
        month_price,
        year_price,
        room_photos_url,
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
