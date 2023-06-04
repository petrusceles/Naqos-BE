const BookingPhaseServices = require("../services/booking.phase.services.js");

const createBookingPhase = async (req, res) => {
  const { name } = req.body;
  const { status, statusCode, message, data } =
    await BookingPhaseServices.createBookingPhaseService({ name });
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

const findAllBookingPhases = async (req, res) => {
  const { status, statusCode, message, data } =
    await BookingPhaseServices.findAllBookingPhasesService();
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

const findBookingPhaseById = async (req, res) => {
  const id = req.params.id;
  const { status, statusCode, message, data } =
    await BookingPhaseServices.findBookingPhaseByIdService({ id });
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

const updateBookingPhaseById = async (req, res) => {
  const { name } = req.body;
  const id = req.params.id;
  const { status, statusCode, message, data } =
    await BookingPhaseServices.updateBookingPhaseByIdService({
      id,
      name,
    });
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

const deleteBookingPhaseById = async (req, res) => {
  const id = req.params.id;
  const { status, statusCode, message, data } =
    await BookingPhaseServices.deleteBookingPhaseByIdService({ id });
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

module.exports = {
  createBookingPhase,
  findAllBookingPhases,
  findBookingPhaseById,
  updateBookingPhaseById,
  deleteBookingPhaseById,
};
