const express = require("express");
const routes = express.Router();
const KostController = require("../controllers/kost.controllers.js");

const upload = require("../middlewares/uploadKostPhotos.js");
const fileEncoder = require("../middlewares/fileEncoder");
const authMiddlerwares = require("../middlewares/auth.js");

routes.post(
  "/",
  authMiddlerwares.checkAuthenticated,
  authMiddlerwares.isTenant,
  upload,
  fileEncoder.fileEncoder,
  KostController.createKost
);


routes.get("/cities", KostController.findAllCities);
routes.get("/", KostController.searchAllKostsByKeyword);
routes.get("/:id", KostController.findKostById);
routes.put(
  "/:id",
  authMiddlerwares.checkAuthenticated,
  authMiddlerwares.isTenant,
  upload,
  fileEncoder.fileEncoder,
  KostController.updateKostById
);
routes.delete(
  "/:id",
  authMiddlerwares.checkAuthenticated,
  authMiddlerwares.isTenant,
  KostController.deleteKostFacilityById
);

module.exports = routes;
