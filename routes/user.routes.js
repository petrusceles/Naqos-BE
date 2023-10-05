const express = require("express");
const routes = express.Router();
const UserControllers = require("../controllers/user.controllers.js");
const authMiddlewares = require("../middlewares/auth.js");

const upload = require("../middlewares/fileUpload");
const fileEncoder = require("../middlewares/fileEncoder");

routes.post("/", UserControllers.createUser);
routes.get("/", UserControllers.findAllUser);
routes.get("/:id", UserControllers.findUserById);
routes.put(
  "/:id",
  upload.single("avatar"),
  fileEncoder.fileEncoder,
  UserControllers.updateUserById
);
routes.delete("/:id", UserControllers.deleteUserById);
routes.post("/verif/send",authMiddlewares.checkAuthenticated, UserControllers.userSendEmailVerif)
routes.post(
  "/verif",
  UserControllers.userVerifEmail
);

module.exports = routes;
