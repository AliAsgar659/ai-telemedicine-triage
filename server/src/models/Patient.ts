import { Schema, model } from "mongoose";

export interface PatientDoc {
  fullName: string;
  dateOfBirth: string;
  sex: "female" | "male" | "other" | "prefer_not_to_say";
  contactPhone: string;
  contactEmail: string;
  medicalHistory: string[];
  currentMedications: string[];
  allergies: string[];
}

const patientSchema = new Schema<PatientDoc>(
  {
    fullName: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    sex: {
      type: String,
      enum: ["female", "male", "other", "prefer_not_to_say"],
      required: true,
    },
    contactPhone: { type: String, required: true },
    contactEmail: { type: String, required: true },
    medicalHistory: { type: [String], default: [] },
    currentMedications: { type: [String], default: [] },
    allergies: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Patient = model<PatientDoc>("Patient", patientSchema);
