const KostFacilityRoutes = require("./kost.facility.routes");
const routes = require("express").Router();

routes.use("/kost-facility", KostFacilityRoutes);

module.exports = routes;
