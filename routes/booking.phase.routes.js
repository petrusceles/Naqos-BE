const express = require("express");
const routes = express.Router();
const BookingPhaseControllers = require("../controllers/booking.phase.controllers.js");
const authMiddlewares = require("../middlewares/auth.js");
routes.post(
  "/",
  authMiddlewares.isAdmin,
  BookingPhaseControllers.createBookingPhase
);
routes.get("/", BookingPhaseControllers.findAllBookingPhases);
routes.get("/:id", BookingPhaseControllers.findBookingPhaseById);
routes.put("/:id", BookingPhaseControllers.updateBookingPhaseById);
routes.delete("/:id", BookingPhaseControllers.deleteBookingPhaseById);

module.exports = routes;
