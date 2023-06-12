const express = require("express");
const routes = express.Router();
const KostController = require("../controllers/kost.controllers.js");

const upload = require("../middlewares/fileUpload");
const fileEncoder = require("../middlewares/fileEncoder");
const authMiddlerwares = require("../middlewares/auth.js");
routes.post(
  "/",
  authMiddlerwares.checkAuthenticated,
  authMiddlerwares.isTenant,
  upload.fields([
    { name: "outside_photos", maxCount: 4 },
    { name: "inside_photos", maxCount: 4 },
  ]),
  fileEncoder.fileEncoder,
  KostController.createKost
);

routes.get("/", KostController.searchAllKostsByKeyword);
routes.get("/:id", KostController.findKostById);
routes.put(
  "/:id",
  authMiddlerwares.checkAuthenticated,
  authMiddlerwares.isTenant,
  upload.fields([
    { name: "outside_photos", maxCount: 4 },
    { name: "inside_photos", maxCount: 4 },
    { name: "outside_photos_onhold_url", maxCount: 4 },
    { name: "inside_photos_onhold_url", maxCount: 4 },
  ]),
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
