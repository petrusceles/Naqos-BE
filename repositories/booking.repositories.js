const Booking = require("../models/booking.model.js");
const opts = {
  runValidators: true,
};
const createBookingRepo = async ({
  user,
  kost,
  phase,
  proof_photo_url,
  in_date,
  out_date,
  time,
  price,
}) => {
  const booking = await Booking.create({
    user,
    kost,
    phase,
    proof_photo_url,
    in_date,
    out_date,
    time,
    price,
  });
  return booking;
};

const findAllBookingsRepo = async ({ query }) => {
  console.log(query)
  const bookings = await Booking.find(query)
    .populate({
      path: "kost",
      populate: {
        path: "user",
        select: "-password",
      },
    })
    .populate({
      path: "user",
      select: "-password",
    });
  return bookings;
};

// const findBooking

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
      path: "user",
      select: "-password",
    });
  return booking;
};

const updateBookingByIdRepo = async ({
  id,
  user,
  kost,
  phase,
  proof_photo_url,
  in_date,
  out_date,
  time,
  price,
}) => {
  const updatedBooking = await Booking.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        user,
        kost,
        phase,
        proof_photo_url,
        in_date,
        out_date,
        time,
        price,
      },
    },
    opts
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
