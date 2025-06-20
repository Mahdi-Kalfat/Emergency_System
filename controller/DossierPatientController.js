const DossierPatient = require("../model/DossierPatient");

// Create a new dossier patient
exports.createDossierPatient = async (req, res) => {
  try {
    const dossierPatient = new DossierPatient(req.body);
    const savedDossier = await dossierPatient.save();
    res.status(201).json(savedDossier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all dossier patients
exports.getAllDossierPatients = async (req, res) => {
  try {
    const dossiers = await DossierPatient.find();
    res.status(200).json(dossiers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single dossier patient by ID
exports.getDossierPatientById = async (req, res) => {
  try {
    const dossier = await DossierPatient.findById(req.params.id);
    if (!dossier) {
      return res.status(404).json({ message: "Dossier not found" });
    }
    res.status(200).json(dossier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a dossier patient by ID
exports.updateDossierPatient = async (req, res) => {
  try {
    const updatedDossier = await DossierPatient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedDossier) {
      return res.status(404).json({ message: "Dossier not found" });
    }
    res.status(200).json(updatedDossier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a dossier patient by ID
exports.deleteDossierPatient = async (req, res) => {
  try {
    const deletedDossier = await DossierPatient.findByIdAndDelete(req.params.id);
    if (!deletedDossier) {
      return res.status(404).json({ message: "Dossier not found" });
    }
    res.status(200).json({ message: "Dossier deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};