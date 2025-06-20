const mongoose = require("mongoose");

const ReclamationSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Non traité", "Traité"],
      default: "Non traité"
    },
    creation_date: {
      type: Date,
      default: Date.now,
    },
    user:{
      type: String,
      required: true,
    },
    userId:{
      type: String,
      required: true,
    },
    role:{
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reclamation", ReclamationSchema);