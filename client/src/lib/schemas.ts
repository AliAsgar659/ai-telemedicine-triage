import { z } from "zod";

export const vitalsFormSchema = z.object({
  temperatureC: z.coerce.number().min(30).max(45).optional().or(z.literal("").transform(() => undefined)),
  heartRateBpm: z.coerce.number().min(20).max(250).optional().or(z.literal("").transform(() => undefined)),
  bloodPressureSystolic: z.coerce.number().min(50).max(260).optional().or(z.literal("").transform(() => undefined)),
  bloodPressureDiastolic: z.coerce.number().min(30).max(180).optional().or(z.literal("").transform(() => undefined)),
  spo2Percent: z.coerce.number().min(50).max(100).optional().or(z.literal("").transform(() => undefined)),
});

export const intakeFormSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required").max(120),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  sex: z.enum(["female", "male", "other", "prefer_not_to_say"]),
  contactPhone: z.string().trim().min(7, "Enter a valid phone number").max(20),
  contactEmail: z.string().trim().email("Enter a valid email address"),

  medicalHistory: z.string().trim().max(1000),
  currentMedications: z.string().trim().max(1000),
  allergies: z.string().trim().max(1000),

  chiefComplaint: z.string().trim().min(5, "Describe the main reason for this visit").max(200),
  symptomDescription: z.string().trim().min(10, "Provide more detail about the symptoms").max(2000),
  durationDays: z.coerce.number().min(0, "Must be 0 or more").max(3650),
  severity: z.coerce.number().min(1).max(10),

  vitals: vitalsFormSchema,
});

export type IntakeFormValues = z.infer<typeof intakeFormSchema>;

export function toCsv(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
