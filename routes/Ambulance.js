var express = require('express');
var router = express.Router();
const AmbulanceController = require("../controller/driverController");

router.post("/test", AmbulanceController.createAmbulance);

module.exports = router;