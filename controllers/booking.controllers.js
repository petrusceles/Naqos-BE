const BookingServices = require("../services/booking.services.js");

const createBooking = async (req, res) => {
  const { kost_id, in_date, out_date } = req.body;
  const user_id = req.session.passport.user._id;
  const { status, statusCode, message, data } =
    await BookingServices.createBookingService({
      buyer_id:user_id,
      kost_id,
      in_date,
      out_date,
    });
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

const findAllBookings = async (req, res) => {
  const { status, statusCode, message, data } =
    await BookingServices.findAllBookingsService();
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

const findBookingById = async (req, res) => {
  const id = req.params.id;
  const { status, statusCode, message, data } =
    await BookingServices.findBookingByIdService({ id });
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

const updateBookingById = async (req, res) => {
  const id = req.params.id;
  const { phase, in_date, out_date } = req.body;
  const user_id = req.session.passport.user._id;
  const proof_photo = req.fileEncoded;
  const { status, statusCode, message, data } =
    await BookingServices.updateBookingByIdService({
      id,
      user_id,
      phase,
      proof_photo,
      in_date,
      out_date,
    });
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

const deleteBookingById = async (req, res) => {
  const id = req.params.id;
  const user_id = req.session.passport.user._id;
  const { status, statusCode, message, data } =
    await BookingServices.deleteBookingById({
      id,
      user_id,
    });
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

module.exports = {
  createBooking,
  findAllBookings,
  findBookingById,
  updateBookingById,
  deleteBookingById,
};
