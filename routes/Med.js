var express = require('express');
var router = express.Router();
const MedController = require("../controller/MedController");
const fileUpload = require('../middleware/fileUpload');

router.get("/medlist", MedController.getAllMeds);
router.post('/create', fileUpload.single('photo'), MedController.createMed);
router.delete('/delete/:id', MedController.deleteMed);
router.put('/addQuantity/:id', MedController.addMedQuantity);
module.exports = router;