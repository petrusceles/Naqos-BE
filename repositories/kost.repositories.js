const mongoose = require("mongoose");
const Kost = require("../models/kost.model.js");

const createKostRepo = async ({
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
  outside_photos_url,
  inside_photos_url,
  room_facilities,
  room_total,
  room_remaining,
  week_price,
  month_price,
  year_price,
  room_photos_url,
}) => {
  // console.log("MASUK-CREATE-KOST")
  const kost = await Kost.create({
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
    outside_photos_url,
    inside_photos_url,
    room_facilities,
    room_total,
    room_remaining,
    week_price,
    month_price,
    year_price,
    room_photos_url,
  });

  return kost;
};

const findAllCitiesRepo = async () => {
  const cities = await Kost.distinct("district");
  return cities;
};

const findAllKostsRepo = async () => {
  const kost = await Kost.find()
    .populate({ path: "user", select: "-password" })
    .populate("kost_facilities")
    .populate("type");
  return kost;
};

const findAllKostsByNameRepo = async ({ name }) => {
  const kosts = await Kost.where("name")
    .equals(name)
    .populate({ path: "user", select: "-password" })
    .populate("kost_facilities")
    .populate("type");
  return kosts;
};

const findAllKostsCountRepo = async ({ query }) => {
  const kostTotal = await Kost.countDocuments(query);
  return kostTotal;
};

const searchAllKostsByKeywordRepo = async ({
  query,
  limit,
  sorted_by,
  sort,
  skip,
}) => {
  sort ??= "asc";
  sorted_by ??= "name";
  const kosts = await Kost.find(query)
    .populate({
      path: "user",
      select: "-password",
    })
    .populate("kost_facilities")
    .populate("room_facilities")
    .populate("type")
    .sort([[sorted_by, sort]])
    .limit(limit)
    .skip(skip);
  return kosts;
};

const findKostByIdRepo = async ({ id }) => {
  // console.log(id);
  const kost = await Kost.findById(id)
    .populate({
      path: "user",
      select: "-password",
    })
    .populate("kost_facilities")
    .populate("room_facilities")
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
  kost_facilities,
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
  week_price,
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
        kost_facilities,
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
        week_price,
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
  findAllCitiesRepo,
  findAllKostsCountRepo,
};
