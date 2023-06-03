const KostFacilityRoutes = require("./kost.facility.routes");
const KostTypeRoutes = require("./kost.type.routes.js");
const routes = require("express").Router();

routes.use("/kost-facility", KostFacilityRoutes);
routes.use("/kost-type", KostTypeRoutes);
module.exports = routes;
