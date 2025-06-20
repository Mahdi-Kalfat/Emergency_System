const mongoose = require('mongoose');

const MaterielSchema = new mongoose.Schema({
    numSerie: { type: String, required: true, unique: true },
    typeMateriel: { 
        type: String, 
        enum: ['Defibrillator', 'Ventilator', 'Monitor', 'Stretcher',  'Other'], 
        required: true 
    },
    nom: { type: String, required: true },
    dateAjout: { type: Date, required: true, get: (date) => date.toISOString().split('T')[0] },
    dateExpiration: { type: Date, required: true, get: (date) => date.toISOString().split('T')[0] },
    quantite: { type: String, required: true },
    photo: { type: String, required: false }

}, { toJSON: { getters: true } });
    
const Materiel = mongoose.model('Materiel', MaterielSchema);
module.exports = Materiel;