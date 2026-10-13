export type UrgencyLevel = "emergency" | "urgent" | "routine";

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

export interface Patient {
  _id: string;
  fullName: string;
  dateOfBirth: string;
  sex: string;
  contactPhone: string;
  contactEmail: string;
  medicalHistory: string[];
  currentMedications: string[];
  allergies: string[];
}

export type ConsultationStatus = "waiting" | "in_consultation" | "completed" | "cancelled";

export interface Consultation {
  _id: string;
  patient: Patient;
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
  createdAt: string;
}

export interface IntakeResponse {
  consultationId: string;
  roomId: string;
  triageLevel: UrgencyLevel;
  priorityScore: number;
  aiMatches: AiMatch[];
}

export interface ChatMessage {
  id: string;
  senderRole: "patient" | "clinician";
  senderName: string;
  body: string;
  createdAt: string;
}
