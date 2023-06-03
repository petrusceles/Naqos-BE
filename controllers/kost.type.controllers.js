const KostTypeServices = require("../services/kost.type.services");

const createKostType = async (req, res) => {
  const { name } = req.body;
  const icon = req.fileEncoded;
  const { status, statusCode, message, data } =
    await KostTypeServices.createKostTypeService({ name, icon });
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

const findAllKostFacilities = async (req, res) => {
  const { status, statusCode, message, data } =
    await KostTypeServices.findAllKostFacilitiesService();
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

const findKostTypeById = async (req, res) => {
  const id = req.params.id;
  const { status, statusCode, message, data } =
    await KostTypeServices.findKostTypeByIdService({ id });
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

const updateKostTypeById = async (req, res) => {
  const { name } = req.body;
  const id = req.params.id;
  const icon = req.fileEncoded;
  const { status, statusCode, message, data } =
    await KostTypeServices.updateKostTypeByIdService({
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

const deleteKostTypeById = async (req, res) => {
  const id = req.params.id;
  const { status, statusCode, message, data } =
    await KostTypeServices.deleteKostTypeByIdService({ id });
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

module.exports = {
  createKostType,
  findAllKostFacilities,
  findKostTypeById,
  updateKostTypeById,
  deleteKostTypeById,
};
