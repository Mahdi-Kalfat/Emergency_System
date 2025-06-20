var express = require('express');
var router = express.Router();
const materielController = require("../controller/materielController");
const fileUpload = require('../middleware/fileUpload');


router.get("/materiellist", materielController.getAllMateriels);
router.post('/create', fileUpload.single('photo'), materielController.createMateriel);
router.delete('/delete/:id', materielController.deleteMateriel);
router.put('/update/:id', fileUpload.single('photo'), materielController.updateMateriel);
router.get('/get/:id', materielController.getMaterielById);

module.exports = router;