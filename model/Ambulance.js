const mongoose = require('mongoose');

const AmbulanceSchema = new mongoose.Schema({
    id_driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
    matricule: { type: String, required: true, unique: true },
    admission_date: { 
        type: Date, 
        required: true,
        validate: {
            validator: function(v) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return v >= today;
            },
            message: props => `Admission date cannot be before today.`
        }
    },
    brand: { type: String, required: true },
    plate_number: { type: String, required: true, unique: true },
    ambulance_type: { 
        type: String, 
        required: true,
        enum: ['Standard', 'Urgent', 'Very Urgent', 'Immediate']
    }
});

// Just date no time
AmbulanceSchema.pre('save', function(next) {
    this.admission_date.setHours(0, 0, 0, 0);
    next();
});

const Ambulance = mongoose.model('Ambulance', AmbulanceSchema);

module.exports = Ambulance;