const express = require("express");
const routes = express.Router();
const KostController = require("../controllers/kost.controllers.js");

const upload = require("../middlewares/fileUpload");
const fileEncoder = require("../middlewares/fileEncoder");

routes.post(
  "/",
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
  upload.fields([
    { name: "outside_photos", maxCount: 4 },
    { name: "inside_photos", maxCount: 4 },
  ]),
  fileEncoder.fileEncoder,
  KostController.updateKostById
);
routes.delete("/:id", KostController.deleteKostFacilityById);

module.exports = routes;
