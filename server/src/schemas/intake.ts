import { z } from "zod";

export const vitalsSchema = z
  .object({
    temperatureC: z.coerce.number().min(30).max(45).optional(),
    heartRateBpm: z.coerce.number().min(20).max(250).optional(),
    bloodPressureSystolic: z.coerce.number().min(50).max(260).optional(),
    bloodPressureDiastolic: z.coerce.number().min(30).max(180).optional(),
    spo2Percent: z.coerce.number().min(50).max(100).optional(),
  })
  .partial();

export const intakeSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required").max(120),
  dateOfBirth: z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "Enter a valid date of birth",
  }),
  sex: z.enum(["female", "male", "other", "prefer_not_to_say"]),
  contactPhone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .max(20),
  contactEmail: z.string().trim().email("Enter a valid email address"),
  medicalHistory: z.array(z.string().trim().min(1)).default([]),
  currentMedications: z.array(z.string().trim().min(1)).default([]),
  allergies: z.array(z.string().trim().min(1)).default([]),

  chiefComplaint: z
    .string()
    .trim()
    .min(5, "Describe the main reason for this visit")
    .max(200),
  symptomDescription: z
    .string()
    .trim()
    .min(10, "Provide more detail about the symptoms")
    .max(2000),
  durationDays: z.coerce.number().min(0).max(3650),
  severity: z.coerce.number().min(1).max(10),
  vitals: vitalsSchema.default({}),
});

export type IntakeInput = z.infer<typeof intakeSchema>;
