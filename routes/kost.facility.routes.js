const express = require("express");
const routes = express.Router();
const KostFacilityControllers = require("../controllers/kost.facility.controllers");
const authMiddlewares = require("../middlewares/auth.js");
const upload = require("../middlewares/fileUpload");
const fileEncoder = require("../middlewares/fileEncoder");

routes.post(
  "/",
  authMiddlewares.isAdmin,
  upload.single("icon"),
  fileEncoder.fileEncoder,
  KostFacilityControllers.createKostFacility
);

routes.get("/", KostFacilityControllers.findAllKostFacilities);
routes.get("/:id", KostFacilityControllers.findKostFacilityById);
routes.put(
  "/:id",
  authMiddlewares.isAdmin,
  upload.single("icon"),
  fileEncoder.fileEncoder,
  KostFacilityControllers.updateKostFacilityById
);
routes.delete(
  "/:id",
  authMiddlewares.isAdmin,
  KostFacilityControllers.deleteKostFacilityById
);

module.exports = routes;
