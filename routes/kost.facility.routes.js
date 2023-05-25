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

module.exports = routes;