const KostService = require("../services/kost.services.js");

const createKost = async (req, res) => {
  const {
    name,
    address,
    province,
    district,
    subdistrict,
    type,
    kost_facilities,
    regulations,
    bans,
    description,
    bank,
    bank_number,
    room_facilities,
    room_total,
    room_remaining,
    week_price,
    month_price,
    year_price,
  } = req.body;

  let outsidePhotos = req.files.outside_photos;
  let insidePhotos = req.files.inside_photos;
  let roomPhotos = req.files.room_photos;
  const user = req.session.passport.user._id;
  const { status, statusCode, message, data } =
    await KostService.createKostService({
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
      outside_photos: outsidePhotos,
      inside_photos: insidePhotos,
      room_facilities,
      room_total,
      room_remaining,
      week_price,
      month_price,
      year_price,
      room_photos: roomPhotos,
    });
  //  return res.send(200, { message: "ok" });
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

const searchAllKostsByKeyword = async (req, res) => {
  const { keyword, limit, sorted_by, skip, sort, ...search_by } = req.query;
  // console.log(skip);
  const { status, statusCode, message, data } =
    await KostService.searchAllKostsByKeywordService({
      keyword,
      limit,
      sorted_by,
      search_by,
      sort,
      skip,
    });
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

const findKostById = async (req, res) => {
  const id = req.params.id;
  const { status, statusCode, message, data } =
    await KostService.findKostByIdService({ id });
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

const updateKostById = async (req, res) => {
  const {
    name,
    address,
    province,
    district,
    subdistrict,
    type,
    kost_facilities,
    regulations,
    bans,
    description,
    outside_photos_onhold_url,
    inside_photos_onhold_url,
    room_facilities,
    room_total,
    room_remaining,
    week_price,
    month_price,
    year_price,
    room_photos_onhold_url,
  } = req.body;
  let outsidePhotos = req.files?.outside_photos;
  let insidePhotos = req.files?.inside_photos;
  let roomPhotos = req.files?.room_photos;
  const user = req.session.passport.user._id;
  const id = req.params.id;

  const { status, statusCode, message, data } =
    await KostService.updateKostByIdService({
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
      outside_photos: outsidePhotos,
      inside_photos: insidePhotos,
      outside_photos_onhold_url,
      inside_photos_onhold_url,
      room_facilities,
      room_total,
      room_remaining,
      week_price,
      month_price,
      year_price,
      room_photos: roomPhotos,
      room_photos_onhold_url,
    });
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

const deleteKostFacilityById = async (req, res) => {
  const id = req.params.id;
  const user = req.session.passport.user._id;
  const { status, statusCode, message, data } =
    await KostService.deleteKostByIdService({ id, user });
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

const findAllCities = async (req, res) => {
  const { status, statusCode, message, data } =
    await KostService.findAllCitiesService();
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

module.exports = {
  createKost,
  searchAllKostsByKeyword,
  findKostById,
  updateKostById,
  deleteKostFacilityById,
  findAllCities,
};
