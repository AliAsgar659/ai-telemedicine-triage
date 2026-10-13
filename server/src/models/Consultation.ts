import { Schema, model, Types } from "mongoose";
import { URGENCY_LEVELS, UrgencyLevel } from "./SymptomEntry.js";

export const CONSULTATION_STATUSES = ["waiting", "in_consultation", "completed", "cancelled"] as const;
export type ConsultationStatus = (typeof CONSULTATION_STATUSES)[number];

export interface AiMatch {
  condition: string;
  urgencyLevel: UrgencyLevel;
  recommendedAction: string;
  specialty: string;
  score: number;
}

export interface VitalSigns {
  temperatureC?: number;
  heartRateBpm?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  spo2Percent?: number;
}

export interface ConsultationDoc {
  patient: Types.ObjectId;
  chiefComplaint: string;
  symptomDescription: string;
  durationDays: number;
  severity: number;
  vitals: VitalSigns;
  aiMatches: AiMatch[];
  triageLevel: UrgencyLevel;
  priorityScore: number;
  status: ConsultationStatus;
  roomId: string;
  clinicianName?: string;
}

const vitalsSchema = new Schema<VitalSigns>(
  {
    temperatureC: Number,
    heartRateBpm: Number,
    bloodPressureSystolic: Number,
    bloodPressureDiastolic: Number,
    spo2Percent: Number,
  },
  { _id: false }
);

const aiMatchSchema = new Schema<AiMatch>(
  {
    condition: { type: String, required: true },
    urgencyLevel: { type: String, enum: URGENCY_LEVELS, required: true },
    recommendedAction: { type: String, required: true },
    specialty: { type: String, required: true },
    score: { type: Number, required: true },
  },
  { _id: false }
);

const consultationSchema = new Schema<ConsultationDoc>(
  {
    patient: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    chiefComplaint: { type: String, required: true },
    symptomDescription: { type: String, required: true },
    durationDays: { type: Number, required: true },
    severity: { type: Number, required: true, min: 1, max: 10 },
    vitals: { type: vitalsSchema, default: {} },
    aiMatches: { type: [aiMatchSchema], default: [] },
    triageLevel: { type: String, enum: URGENCY_LEVELS, required: true },
    priorityScore: { type: Number, required: true },
    status: { type: String, enum: CONSULTATION_STATUSES, default: "waiting" },
    roomId: { type: String, required: true, unique: true },
    clinicianName: String,
  },
  { timestamps: true }
);

export const Consultation = model<ConsultationDoc>("Consultation", consultationSchema);
