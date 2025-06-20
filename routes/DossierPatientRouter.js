const express = require("express");
const router = express.Router();
const DossierPatientController = require("../controller/DossierPatientController");

// Create a new dossier patient
router.post("/add", DossierPatientController.createDossierPatient);

// Get all dossier patients
router.get("/get", DossierPatientController.getAllDossierPatients);

// Get a single dossier patient by ID
router.get("/getbyid/:id", DossierPatientController.getDossierPatientById);

// Update a dossier patient by ID
router.put("/edit/:id", DossierPatientController.updateDossierPatient);

// Delete a dossier patient by ID
router.delete("/delete/:id", DossierPatientController.deleteDossierPatient);

module.exports = router;
