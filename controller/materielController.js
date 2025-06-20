const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const Materiel = require('../model/materiel');

// Create a new Materiel
const createMateriel = async (req, res) => {
    try {
        // Generate a unique name for the image
        const imageName = req.file ? crypto.randomBytes(16).toString('hex') + path.extname(req.file.originalname) : null;
        const uploadPath = path.join(__dirname, '../uploads/materiel', imageName);

        // Save the image to the server
        if (req.file) {
            fs.writeFileSync(uploadPath, req.file.buffer);
        }

        // Create the Materiel with the image path
        const materiel = new Materiel({
            ...req.body,
            photo: imageName ? `/uploads/materiel/${imageName}` : null
        });

        await materiel.save();
        res.status(201).json(materiel);
    } catch (error) {
        console.error("Error creating medicament:", error);
        res.status(400).json({ error: error.message });
    }
}
// Get all Materiel
const getAllMateriels = async (req, res) => {
    try {
        const materiels = await Materiel.find();
        res.status(200).json(materiels);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
// Get a Materiel by ID
const getMaterielById = async (req, res) => {
    try {
        const materiel = await Materiel.findById(req.params.id);
        if (!materiel) {
            return res.status(404).json({ error: 'Materiel not found' });
        }
        res.status(200).json(materiel);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
// Update a Materiel by ID
const updateMateriel = async (req, res) => {
    try {
        const materiel = await Materiel.findByIdAndUpdate(req.params.id
, req.body, { new: true, runValidators: true });
        if (!materiel) {
            return res.status(404).json({ error: 'Materiel not found' });
        }
        res.status(200).json(materiel);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}
// Delete a Materiel by ID
const deleteMateriel = async (req, res) => {
    try {
        const materiel = await Materiel.findByIdAndDelete(req.params.id);
        if (!materiel) {
            return res.status(404).json({ error: 'Materiel not found' });
        }
        res.status(200).json({ message: 'Materiel deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createMateriel,
    getAllMateriels,
    getMaterielById,
    updateMateriel,
    deleteMateriel
};
