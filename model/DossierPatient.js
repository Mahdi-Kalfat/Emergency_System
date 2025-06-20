const mongoose = require("mongoose");

const DossierPatientSchema = new mongoose.Schema(
  {
    id_patient: {
      type: String,
      required: true,
    },
    Pregnancies: { type: Number, required: true },
    Glucose: { type: Number, required: true },
    BloodPressure: { type: Number, required: true },
    SkinThickness: { type: Number, required: true },
    Insulin: { type: Number, required: true },
    BMI: { type: Number, required: true },
    DiabetesPedigreeFunction: { type: Number, required: true },
    Age: { type: Number, required: true },
    Outcome: { type: Number },
  },
  { timestamps: true }
);

const DossierPatient = mongoose.model("DossierPatient", DossierPatientSchema);

module.exports = DossierPatient;