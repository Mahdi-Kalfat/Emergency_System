const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phoneNumber: { 
        type: String, 
        required: true,
        validate: {
            validator: function(v) {
                return /^\d{8}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number! It should be exactly 8 digits.`
        }
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        validate: {
            validator: function(v) {
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    role: { 
        type: String, 
        enum: ['Patient', 'Doctor', 'Nurse', 'Driver', 'worker', 'Chef'], 
        required: true 
    },
    password: { type: String, required: true },
    country: { type: String },
    city: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

const PatientSchema = new mongoose.Schema({
    id_patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    allergies: { type: [String] },
    chronicDiseases: { type: [String] },
    creation_date: { 
        type: Date, 
        default: Date.now,
        validate: {
            validator: function(v) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return v >= today;
            },
            message: props => `Creation date cannot be before today.`
        }
    },
    modification_date: { 
        type: Date, 
        default: Date.now,
        validate: {
            validator: function(v) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return v >= today;
            },
            message: props => `Modification date cannot be before today.`
        }
    }
});

// Just date no time
PatientSchema.pre('save', function(next) {
    this.creation_date.setHours(0, 0, 0, 0);
    this.modification_date.setHours(0, 0, 0, 0);
    next();
});

const Patient = mongoose.model('Patient', PatientSchema);


const PersonalSchema = new mongoose.Schema({
    id_personal: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    age: { 
        type: Number, 
        required: true,
        min: [20, 'Age must be at least 20'],
        max: [70, 'Age must be at most 70']
    },
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
    conge: { type: Boolean, required: true },
    nbr_conge: { 
        type: Number, 
        required: true,
        min: [0, 'Number of conge must be at least 0'],
        max: [25, 'Number of conge must be at most 25']
    },
    name: { type: String },
    email: { 
        type: String,
        validate: {
            validator: function(v) {
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    phoneNumber: { 
        type: String,
        validate: {
            validator: function(v) {
                return /^\d{8}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number! It should be exactly 8 digits.`
        }
    },
    role: { type: String },
});

// Just date no time
PersonalSchema.pre('save', function(next) {
    this.admission_date.setHours(0, 0, 0, 0);
    next();
});

const Personal = mongoose.model('Personal', PersonalSchema);

const DoctorSchema = new mongoose.Schema({
    id_doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Personal', required: true },
    speciality: { 
        type: String,
        required: true,
        enum: ['Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 'Psychiatry', 'Radiology', 'Surgery']
    },
    grade: { 
        type: String,
        required: true,
        enum: ['Junior', 'Senior', 'Consultant']
    }
});

const Doctor = mongoose.model('Doctor', DoctorSchema);

const NurseSchema = new mongoose.Schema({
    id_nurse: { type: mongoose.Schema.Types.ObjectId, ref: 'Personal', required: true },
    poste_inf: { 
        type: String,
        required: true,
        enum: ['General', 'Pediatric', 'Surgical', 'Psychiatric', 'Critical Care', 'Oncology', 'Geriatric']
    },
    grade_inf: { 
        type: String,
        required: true,
        enum: ['Junior', 'Senior', 'Head Nurse']
    }
});

const Nurse = mongoose.model('Nurse', NurseSchema);

const DriverSchema = new mongoose.Schema({
    id_driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Personal', required: true },
    experience: { 
        type: String,
        required: true,
        enum: ['Beginner', 'Intermediate', 'Expert']
    },
    garde: { 
        type: String,
        required: true,
        enum: ['Day', 'Night']
    }
});

const Driver = mongoose.model('Driver', DriverSchema);

const WorkerSchema = new mongoose.Schema({
    id_worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Personal', required: true },
    poste: { 
        type: String,
        required: true,
        enum: ['Maintenance', 'Cleaning', 'Security', 'Administration']
    }
});

const Worker = mongoose.model('Worker', WorkerSchema);

const ServiceChiefSchema = new mongoose.Schema({
    id_chef: { type: mongoose.Schema.Types.ObjectId, ref: 'Personal', required: true },
    speciality_chief: { 
        type: String,
        required: true,
        enum: ['Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 'Psychiatry', 'Radiology', 'Surgery']
    },
    garde: { 
        type: String,
        required: true,
        enum: ['Junior', 'Senior', 'Consultant']
    }
});

const ServiceChief = mongoose.model('ServiceChief', ServiceChiefSchema);

module.exports = { User, Patient, Personal, Doctor, Nurse, Driver, Worker, ServiceChief };
    