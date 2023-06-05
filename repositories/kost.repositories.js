const Kost = require("../models/kost.model.js");

const createKostRepo = async ({
  name,
  user_id,
  address,
  province,
  district,
  subdistrict,
  type_id,
  facilities_id,
  regulations,
  bans,
  description,
  question,
  answers,
  outsides_photos_url,
  inside_photos_url,
  bank,
  bank_number,
}) => {
  const kost = await Kost.create({
    name,
    user_id,
    address,
    province,
    district,
    subdistrict,
    type_id,
    facilities_id,
    regulations,
    bans,
    description,
    question,
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

const findKostByIdRepo = async ({ id }) => {
  const kost = await Kost.findById(id);
  return kost;
};

const updateKostByIdRepo = async ({
  id,
  name,
  user_id,
  address,
  province,
  district,
  subdistrict,
  type_id,
  facilities_id,
  regulations,
  bans,
  description,
  question,
  answers,
  outsides_photos_url,
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
        user_id,
        address,
        province,
        district,
        subdistrict,
        type_id,
        facilities_id,
        regulations,
        bans,
        description,
        question,
        answers,
        outsides_photos_url,
        inside_photos_url,
        bank,
        bank_number,
      },
    }
  );
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
};
