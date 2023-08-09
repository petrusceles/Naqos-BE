const express = require("express");
const routes = express.Router();
const RoomFacilityControllers = require("../controllers/room.facility.controllers");
const authMiddlewares = require("../middlewares/auth.js");
const upload = require("../middlewares/fileUpload");
const fileEncoder = require("../middlewares/fileEncoder");

routes.post(
  "/",
  authMiddlewares.isAdmin,
  upload.single("icon"),
  fileEncoder.fileEncoder,
  RoomFacilityControllers.createRoomFacility
);

routes.get("/", RoomFacilityControllers.findAllRoomFacilities);
routes.get("/:id", RoomFacilityControllers.findRoomFacilityById);
routes.put(
  "/:id",
  authMiddlewares.isAdmin,
  upload.single("icon"),
  fileEncoder.fileEncoder,
  RoomFacilityControllers.updateRoomFacilityById
);
routes.delete(
  "/:id",
  authMiddlewares.isAdmin,
  RoomFacilityControllers.deleteRoomFacilityById
);

module.exports = routes;
