const KostFacilityServices = require("../services/kost.facility.services");

const createKostFacility = async (req, res) => {
  const { name } = req.body;
  const icon = req.fileEncoded;
  const { status, statusCode, message, data } =
    await KostFacilityServices.createKostFacilityService({ name, icon });
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

const findAllKostFacilities = async (req, res) => {
  const { status, statusCode, message, data } =
    await KostFacilityServices.findAllKostFacilitiesService();
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

const findKostFacilityById = async (req, res) => {
  const id = req.params.id;
  const { status, statusCode, message, data } =
    await KostFacilityServices.findKostFacilityByIdService({ id });
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

const updateKostFacilityById = async (req, res) => {
  const { name } = req.body;
  const id = req.params.id;
  const icon = req.fileEncoded;
  const { status, statusCode, message, data } =
    await KostFacilityServices.updateKostFacilityByIdService({
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

const deleteKostFacilityById = async (req, res) => {
  const id = req.params.id;
  const { status, statusCode, message, data } =
    await KostFacilityServices.deleteKostFacilityByIdService({ id });
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

module.exports = {
  createKostFacility,
  findAllKostFacilities,
  findKostFacilityById,
  updateKostFacilityById,
  deleteKostFacilityById,
};
