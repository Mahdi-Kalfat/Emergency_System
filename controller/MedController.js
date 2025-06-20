const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const Med = require('../model/Med');

// Create a new medicament
const createMed = async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        console.log("Uploaded File:", req.file);

        let imageName = null;

        if (req.file) {
            const imageExtension = path.extname(req.file.originalname).slice(1); // Get file extension
            const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
            imageName = `${req.body.nom}-${currentDate}-${crypto.randomBytes(8).toString('hex')}.${imageExtension}`;
            const uploadPath = path.join(__dirname, '../uploads/medicament', imageName);

            // Ensure the directory exists
            fs.mkdirSync(path.dirname(uploadPath), { recursive: true });

            // Save the file to the uploads/medicament folder
            fs.writeFileSync(uploadPath, req.file.buffer);
        }

        // Create the medicament with the image path
        const med = new Med({
            ...req.body,
            photo: imageName ? `/uploads/medicament/${imageName}` : null
        });

        await med.save();
        res.status(201).json(med);
    } catch (error) {
        console.error("Error creating medicament:", error);
        res.status(400).json({ error: error.message });
    }
};

// Get all medicaments
const getAllMeds = async (req, res) => {
    try {
        const meds = await Med.find();
        res.status(200).json(meds);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a medicament by ID
const getMedById = async (req, res) => {
    try {
        const med = await Med.findById(req.params.id);
        if (!med) {
            return res.status(404).json({ error: 'Medicament not found' });
        }
        res.status(200).json(med);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a medicament by ID
const updateMed = async (req, res) => {
    try {
        const med = await Med.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!med) {
            return res.status(404).json({ error: 'Medicament not found' });
        }
        res.status(200).json(med);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a medicament by ID
const deleteMed = async (req, res) => {
    try {
        const med = await Med.findByIdAndDelete(req.params.id);
        if (!med) {
            return res.status(404).json({ error: 'Medicament not found' });
        }
        res.status(200).json({ message: 'Medicament deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addMedQuantity = async (req, res) => {
    try {
        const med = await Med.findById(req.params.id);
        if (!med) {
            return res.status(404).json({ error: 'Medicament not found' });
        }
        med.quantity = med.quantity + 10;
        await med.save();
        res.status(200).json(med);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const removeMedQuantity = async (req, res) => {
    try {
        const med = await Med.findById(req.params.id);
        if (!med) {
            return res.status(404).json({ error: 'Medicament not found' });
        }
        if (med.quantity < req.body.quantity) {
            return res.status(400).json({ error: 'Insufficient quantity' });
        }
        med.quantity -= 10;
        await med.save();
        res.status(200).json(med);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createMed,
    getAllMeds,
    getMedById,
    updateMed,
    deleteMed,
    addMedQuantity,
    removeMedQuantity
};
