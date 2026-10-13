import { randomUUID } from "node:crypto";
import { Router } from "express";
import { intakeSchema } from "../schemas/intake.js";
import { validateBody } from "../middleware/validate.js";
import { Patient } from "../models/Patient.js";
import { Consultation } from "../models/Consultation.js";
import { getEmbedding } from "../services/embeddings.js";
import { matchSymptoms } from "../services/vectorSearch.js";
import { computeTriage } from "../services/triage.js";

export const intakeRouter = Router();

intakeRouter.post("/", validateBody(intakeSchema), async (req, res, next) => {
  try {
    const input = req.body as import("../schemas/intake.js").IntakeInput;

    const patient = await Patient.create({
      fullName: input.fullName,
      dateOfBirth: input.dateOfBirth,
      sex: input.sex,
      contactPhone: input.contactPhone,
      contactEmail: input.contactEmail,
      medicalHistory: input.medicalHistory,
      currentMedications: input.currentMedications,
      allergies: input.allergies,
    });

    const symptomText = `${input.chiefComplaint}. ${input.symptomDescription}`;
    const embedding = await getEmbedding(symptomText);
    const matches = await matchSymptoms(embedding, 3);

    const aiMatches = matches.map((match) => ({
      condition: match.condition,
      urgencyLevel: match.urgencyLevel,
      recommendedAction: match.recommendedAction,
      specialty: match.specialty,
      score: Number(match.score.toFixed(4)),
    }));

    const { triageLevel, priorityScore } = computeTriage(aiMatches, input.severity, input.vitals);

    const consultation = await Consultation.create({
      patient: patient._id,
      chiefComplaint: input.chiefComplaint,
      symptomDescription: input.symptomDescription,
      durationDays: input.durationDays,
      severity: input.severity,
      vitals: input.vitals,
      aiMatches,
      triageLevel,
      priorityScore,
      status: "waiting",
      roomId: randomUUID(),
    });

    res.status(201).json({
      consultationId: consultation._id,
      roomId: consultation.roomId,
      triageLevel,
      priorityScore,
      aiMatches,
    });
  } catch (error) {
    next(error);
  }
});
