const express = require("express");
const routes = express.Router();
const KostTypeControllers = require("../controllers/kost.type.controllers");
const authMiddlewares = require("../middlewares/auth.js");
const upload = require("../middlewares/fileUpload");
const fileEncoder = require("../middlewares/fileEncoder");

routes.post(
  "/",
  authMiddlewares.isAdmin,
  upload.single("icon"),
  fileEncoder.fileEncoder,
  KostTypeControllers.createKostType
);

routes.get("/", KostTypeControllers.findAllKostTypes);
routes.get("/:id", KostTypeControllers.findKostTypeById);
routes.put(
  "/:id",
  authMiddlewares.isAdmin,
  upload.single("icon"),
  fileEncoder.fileEncoder,
  KostTypeControllers.updateKostTypeById
);
routes.delete(
  "/:id",
  authMiddlewares.isAdmin,
  KostTypeControllers.deleteKostTypeById
);

module.exports = routes;
