const express = require("express");
const routes = express.Router();
const RoomFacilityControllers = require("../controllers/room.facility.controllers");

const upload = require("../middlewares/fileUpload");
const fileEncoder = require("../middlewares/fileEncoder");

routes.post(
  "/",
  upload.single("icon"),
  fileEncoder.fileEncoder,
  RoomFacilityControllers.createRoomFacility
);

routes.get("/", RoomFacilityControllers.findAllRoomFacilities);
routes.get("/:id", RoomFacilityControllers.findRoomFacilityById);
routes.put(
  "/:id",
  upload.single("icon"),
  fileEncoder.fileEncoder,
  RoomFacilityControllers.updateRoomFacilityById
);
routes.delete("/:id", RoomFacilityControllers.deleteRoomFacilityById);

module.exports = routes;
