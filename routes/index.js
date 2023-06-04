const KostFacilityRoutes = require("./kost.facility.routes");
const KostTypeRoutes = require("./kost.type.routes.js");
const RoomFacilityRoutes = require("./room.facility.routes.js");
const RoleRoutes = require("./roles.routes.js");
const BookingPhaseRoutes = require("./booking.phase.routes.js");
const routes = require("express").Router();

routes.use("/kost-facility", KostFacilityRoutes);
routes.use("/kost-type", KostTypeRoutes);
routes.use("/room-facility", RoomFacilityRoutes);
routes.use("/role", RoleRoutes);
routes.use("/booking-phase", BookingPhaseRoutes);
module.exports = routes;
