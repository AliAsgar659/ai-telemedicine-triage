import { AiMatch, VitalSigns } from "../models/Consultation.js";
import { UrgencyLevel } from "../models/SymptomEntry.js";

const URGENCY_WEIGHT: Record<UrgencyLevel, number> = {
  emergency: 100,
  urgent: 55,
  routine: 15,
};

function vitalsRedFlagScore(vitals: VitalSigns): number {
  let score = 0;
  if (vitals.spo2Percent !== undefined && vitals.spo2Percent < 92) score += 40;
  if (vitals.heartRateBpm !== undefined && (vitals.heartRateBpm > 130 || vitals.heartRateBpm < 45)) score += 20;
  if (vitals.temperatureC !== undefined && vitals.temperatureC >= 39.5) score += 15;
  if (vitals.bloodPressureSystolic !== undefined && vitals.bloodPressureSystolic > 180) score += 20;
  if (vitals.bloodPressureSystolic !== undefined && vitals.bloodPressureSystolic < 90) score += 20;
  return score;
}

/**
 * Combines the best AI knowledge-base match, patient-reported severity, and
 * any abnormal vitals into a single priority score used to order the
 * clinician queue, plus a coarse triage bucket for display.
 */
export function computeTriage(
  aiMatches: AiMatch[],
  severity: number,
  vitals: VitalSigns
): { triageLevel: UrgencyLevel; priorityScore: number } {
  const bestMatch = aiMatches[0];
  const matchWeight = bestMatch ? URGENCY_WEIGHT[bestMatch.urgencyLevel] * bestMatch.score : 0;
  const severityScore = severity * 6;
  const vitalsScore = vitalsRedFlagScore(vitals);

  const priorityScore = Math.round(matchWeight + severityScore + vitalsScore);

  let triageLevel: UrgencyLevel = "routine";
  if (priorityScore >= 70 || vitalsScore >= 40) {
    triageLevel = "emergency";
  } else if (priorityScore >= 35) {
    triageLevel = "urgent";
  }

  return { triageLevel, priorityScore };
}
