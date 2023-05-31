const express = require("express");
const routes = express.Router();
const KostFacilityControllers = require("../controllers/kost.facility.controllers");

const upload = require("../middlewares/fileUpload");
const fileEncoder = require("../middlewares/fileEncoder");

routes.post(
  "/",
  upload.single("icon"),
  fileEncoder.fileEncoder,
  KostFacilityControllers.createKostFacility
);

routes.get("/", KostFacilityControllers.findAllKostFacilities);
routes.get("/:id", KostFacilityControllers.findKostFacilityById);
routes.put(
  "/:id",
  upload.single("icon"),
  fileEncoder.fileEncoder,
  KostFacilityControllers.updateKostFacilityById
);
routes.delete("/:id", KostFacilityControllers.deleteKostFacilityById);

module.exports = routes;
