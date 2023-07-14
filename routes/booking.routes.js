const express = require("express");
const routes = express.Router();
const BookingControllers = require("../controllers/booking.controllers.js");

const upload = require("../middlewares/fileUpload");
const fileEncoder = require("../middlewares/fileEncoder");
const authMiddlewares = require("../middlewares/auth.js")
routes.post("/",authMiddlewares.checkAuthenticated, authMiddlewares.isBuyer, BookingControllers.createBooking);
routes.get("/", BookingControllers.findAllBookings);
routes.get("/:id", BookingControllers.findBookingById);
routes.put(
  "/:id",
  authMiddlewares.checkAuthenticated,
  upload.single("proof_photo"),
  fileEncoder.fileEncoder,
  BookingControllers.updateBookingById
);
routes.delete(
  "/:id",
  authMiddlewares.checkAuthenticated,
  BookingControllers.deleteBookingById
);

module.exports = routes;
