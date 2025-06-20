var express = require('express');
var router = express.Router();
const ReclamationController = require("../controller/ReclamationController");

router.post("/addRec", ReclamationController.createReclamation);
router.put("/editRec/:id", ReclamationController.updateReclamation);
router.delete("/deleteRec/:id", ReclamationController.deleteReclamation);
router.get("/getRec/:id", ReclamationController.getReclamationById);
router.get("/getAllRec", ReclamationController.getAllReclamations);
router.put("/updateStatus/:id", ReclamationController.updateStatus); 
router.get("/getAllRecByIdPatient/:id", ReclamationController.allreclamationsWithIdPatient);

module.exports = router;