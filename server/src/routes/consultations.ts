import { Router } from "express";
import { z } from "zod";
import { Consultation, CONSULTATION_STATUSES } from "../models/Consultation.js";
import { validateBody } from "../middleware/validate.js";

export const consultationsRouter = Router();

const URGENCY_SORT_WEIGHT: Record<string, number> = { emergency: 0, urgent: 1, routine: 2 };

consultationsRouter.get("/", async (req, res, next) => {
  try {
    const status = typeof req.query.status === "string" ? req.query.status : undefined;
    const filter = status ? { status } : { status: { $in: ["waiting", "in_consultation"] } };

    const consultations = await Consultation.find(filter).populate("patient").lean();

    consultations.sort((a, b) => {
      const urgencyDiff = URGENCY_SORT_WEIGHT[a.triageLevel] - URGENCY_SORT_WEIGHT[b.triageLevel];
      if (urgencyDiff !== 0) return urgencyDiff;
      return b.priorityScore - a.priorityScore;
    });

    res.json({ consultations });
  } catch (error) {
    next(error);
  }
});

consultationsRouter.get("/:id", async (req, res, next) => {
  try {
    const consultation = await Consultation.findById(req.params.id).populate("patient").lean();
    if (!consultation) return res.status(404).json({ error: "Consultation not found" });
    res.json({ consultation });
  } catch (error) {
    next(error);
  }
});

const statusUpdateSchema = z.object({
  status: z.enum(CONSULTATION_STATUSES),
  clinicianName: z.string().trim().min(1).max(120).optional(),
});

consultationsRouter.patch("/:id/status", validateBody(statusUpdateSchema), async (req, res, next) => {
  try {
    const consultation = await Consultation.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, ...(req.body.clinicianName ? { clinicianName: req.body.clinicianName } : {}) },
      { new: true }
    ).populate("patient");

    if (!consultation) return res.status(404).json({ error: "Consultation not found" });
    res.json({ consultation });
  } catch (error) {
    next(error);
  }
});
