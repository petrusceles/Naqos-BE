const BookingServices = require("../services/booking.services.js");

const createBooking = async (req, res) => {
  const { kost_id, in_date, out_date, time, price } = req.body;
  const user_id = req.session.passport.user._id;
  const { status, statusCode, message, data } =
    await BookingServices.createBookingService({
      user_id,
      kost_id,
      in_date,
      out_date,
      time,
      price,
    });
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};

const findAllBookings = async (req, res) => {
  let { skip, limit,sorted_by,sort, ...search_by } = req.query;
  const { status, statusCode, message, data } =
    await BookingServices.findAllBookingsService({
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
  const { phase, in_date, out_date, price, time } = req.body;
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
      price,
      time,
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
