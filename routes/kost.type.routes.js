const express = require("express");
const routes = express.Router();
const KostTypeControllers = require("../controllers/kost.type.controllers");

const upload = require("../middlewares/fileUpload");
const fileEncoder = require("../middlewares/fileEncoder");

routes.post(
  "/",
  upload.single("icon"),
  fileEncoder.fileEncoder,
  KostTypeControllers.createKostType
);

routes.get("/", KostTypeControllers.findAllKostTypes);
routes.get("/:id", KostTypeControllers.findKostTypeById);
routes.put(
  "/:id",
  upload.single("icon"),
  fileEncoder.fileEncoder,
  KostTypeControllers.updateKostTypeById
);
routes.delete("/:id", KostTypeControllers.deleteKostTypeById);

module.exports = routes;
