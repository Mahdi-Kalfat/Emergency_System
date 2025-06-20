const mongoose = require('mongoose');

const MedSchema = new mongoose.Schema({
    numSerie: { type: String, required: true, unique: true },
    typeMedicament: { 
        type: String, 
        enum: ['Antibiotic', 'Analgesic', 'Antipyretic', 'Antiseptic', 'Vaccine', 'Other'], 
        required: true 
    },
    nom: { type: String, required: true },
    dateAjout: { type: Date, required: true, get: (date) => date.toISOString().split('T')[0] },
    dateExpiration: { type: Date, required: true, get: (date) => date.toISOString().split('T')[0] },
    quantite: { type: String, required: true },
    photo: { type: String, required: false }
}, { toJSON: { getters: true } });

const Med = mongoose.model('Med', MedSchema);

module.exports = Med;