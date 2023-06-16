const BookingPhase = require("../models/booking.phase.model.js");

const findBookingPhaseByIdRepo = async ({ id }) => {
  const role = await BookingPhase.findById(id);
  return role;
};

const findBookingPhasesByNameRepo = async ({ name }) => {
  const roles = await BookingPhase.findOne({name});
  return roles;
};

const findAllBookingPhasesRepo = async () => {
  const roles = await BookingPhase.find();
  return roles;
};

const createBookingPhaseRepo = async ({ name }) => {
  const newBookingPhase = await BookingPhase.create({ name });
  return newBookingPhase;
};

const updateBookingPhaseByIdRepo = async ({ id, name }) => {
  const updatedBookingPhase = await BookingPhase.updateOne(
    {
      _id: id,
    },
    { $set: { name } }
  );
  return updatedBookingPhase;
};

const deleteBookingPhaseByIdRepo = async ({ id }) => {
  const deletedBookingPhase = await BookingPhase.deleteOne({
    _id: id,
  });
  return deletedBookingPhase;
};

module.exports = {
  findAllBookingPhasesRepo,
  findBookingPhaseByIdRepo,
  updateBookingPhaseByIdRepo,
  createBookingPhaseRepo,
  deleteBookingPhaseByIdRepo,
  findBookingPhasesByNameRepo,
};
