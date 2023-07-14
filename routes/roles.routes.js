const express = require("express");
const routes = express.Router();
const RoleControllers = require("../controllers/role.controllers");

routes.post("/", RoleControllers.createRole);
routes.get("/", RoleControllers.findAllRoles);
routes.get("/:id", RoleControllers.findRoleById);
routes.put("/:id", RoleControllers.updateRoleById);
routes.delete("/:id", RoleControllers.deleteRoleById);

module.exports = routes;
