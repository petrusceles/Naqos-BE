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

const findAllBookingsRepo = async ({ query, limit, sorted_by, sort, skip }) => {
  console.log("QUERY", query["$and"][1]);
  console.log("QUERY_AFTER", query);
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
    })
    .sort([[sorted_by, sort]])
    .skip(skip)
    .limit(limit);
  return bookings;
};

const findAllBookingsCountRepo = async ({ query }) => {
  const bookingTotal = await Booking.count(query);
  return bookingTotal;
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
  findAllBookingsCountRepo,
};
