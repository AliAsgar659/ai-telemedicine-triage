import { Schema, model } from "mongoose";

export const URGENCY_LEVELS = ["emergency", "urgent", "routine"] as const;
export type UrgencyLevel = (typeof URGENCY_LEVELS)[number];

export interface SymptomEntryDoc {
  condition: string;
  description: string;
  sampleSymptoms: string[];
  urgencyLevel: UrgencyLevel;
  recommendedAction: string;
  specialty: string;
  embedding: number[];
  embeddingProvider: string;
}

const symptomEntrySchema = new Schema<SymptomEntryDoc>(
  {
    condition: { type: String, required: true },
    description: { type: String, required: true },
    sampleSymptoms: { type: [String], required: true },
    urgencyLevel: { type: String, enum: URGENCY_LEVELS, required: true },
    recommendedAction: { type: String, required: true },
    specialty: { type: String, required: true },
    embedding: { type: [Number], required: true },
    embeddingProvider: { type: String, required: true },
  },
  { timestamps: true }
);

export const SymptomEntry = model<SymptomEntryDoc>("SymptomEntry", symptomEntrySchema);
