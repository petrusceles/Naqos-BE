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

module.exports = {
  createKostFacility,
};
