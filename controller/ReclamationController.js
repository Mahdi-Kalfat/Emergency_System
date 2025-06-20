const Reclamation = require("../model/Reclamation");
const { User, Patient, Personal, Doctor, Nurse, Driver, Worker, ServiceChief } = require('../model/User');

// Ajouter une nouvelle réclamation
const createReclamation = async (req, res) => {
  try {
    const { subject, message, user } = req.body;

    // Validate required fields
    if (!subject || !message || !user) {
      return res.status(400).json({ message: "All fields (subject, message, user) are required." });
    }

    // Find the user in the database
    const userFound = await User.findById(user);
    if (!userFound) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Create and save the reclamation
    const reclamation = new Reclamation({
      subject,
      message,
      user: userFound.name,
      userId: userFound._id, // Store the user's ID
      role: userFound.role // Store the user's name
    });

    await reclamation.save();
    res.status(201).json(reclamation);
  } catch (error) {
    console.error("Error creating reclamation:", error);
    res.status(500).json({ error: error.message });
  }
};

// Récupérer toutes les réclamations
const getAllReclamations = async (req, res) => {
  try {
    const reclamations = await Reclamation.find().sort({ createdAt: -1 });
    res.status(200).json(reclamations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer une réclamation par ID
const getReclamationById = async (req, res) => {
  try {
    const reclamation = await Reclamation.findById(req.params.id);
    if (!reclamation) {
      return res.status(404).json({ message: "Réclamation non trouvée" });
    }
    res.status(200).json(reclamation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const reclamation = await Reclamation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!reclamation) {
      return res.status(404).json({ message: "Réclamation non trouvée" });
    }
    res.status(200).json(reclamation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Mettre à jour une réclamation
const updateReclamation = async (req, res) => {
  try {
    const { subject, message } = req.body;
    const reclamation = await Reclamation.findByIdAndUpdate(
      req.params.id,
      { subject, message },
      { new: true } // Retourner la nouvelle version mise à jour
    );
    if (!reclamation) {
      return res.status(404).json({ message: "Réclamation non trouvée" });
    }
    res.status(200).json(reclamation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Supprimer une réclamation
const deleteReclamation = async (req, res) => {
  try {
    const reclamation = await Reclamation.findByIdAndDelete(req.params.id);
    if (!reclamation) {
      return res.status(404).json({ message: "Réclamation non trouvée" });
    }
    res.status(200).json({ message: "Réclamation supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const allreclamationsWithIdPatient = async (req, res) => {
  try {
    const reclamations = await Reclamation.aggregate([
      { $match: { userId: req.params.id } }, // Use req.params.id instead of req.body.id
    ]);

    if (reclamations.length === 0) {
      return res.status(404).json({ message: "Aucune réclamation trouvée pour cet utilisateur" });
    }

    res.status(200).json(reclamations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createReclamation,
  getAllReclamations,
  getReclamationById,
  updateReclamation,
  deleteReclamation,
  updateStatus,
  allreclamationsWithIdPatient,
};