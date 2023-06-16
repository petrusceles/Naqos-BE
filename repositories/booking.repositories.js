const Booking = require("../models/booking.model.js");

const createBookingRepo = async ({
  buyer,
  kost,
  phase,
  proof_photo_url,
  in_date,
  out_date,
}) => {
  const booking = await Booking.create({
    buyer,
    kost,
    phase,
    proof_photo_url,
    in_date,
    out_date,
  });
  return booking;
};

const findAllBookingsRepo = async () => {
  const bookings = await Booking.find()
    .populate({
      path: "kost",
      populate: {
        path: "user",
        select: "-password",
      },
    })
    .populate({
      path: "buyer",
      select: "-password",
    })
    .populate("phase");
  return bookings;
};

const findBookingByIdRepo = async ({ id }) => {
  const booking = await Booking.findById(id)
    .populate({
      path: "kost",
      populate: {
        path: "user",
        select: "-password",
      },
    })
    .populate({
      path: "buyer",
      select: "-password",
    })
    .populate("phase");
  return booking;
};

const updateBookingByIdRepo = async ({
  id,
  buyer,
  kost,
  phase,
  proof_photo_url,
  in_date,
  out_date,
}) => {
  const updatedBooking = await Booking.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        buyer,
        kost,
        phase,
        proof_photo_url,
        in_date,
        out_date,
      },
    }
  );

  return updatedBooking;
};

const deleteBookingByIdRepo = async ({ id }) => {
  const deletedBooking = await Booking.deleteOne({
    _id: id,
  });
  return deletedBooking;
};

module.exports = {
  createBookingRepo,
  findAllBookingsRepo,
  findBookingByIdRepo,
  updateBookingByIdRepo,
  deleteBookingByIdRepo,
};
