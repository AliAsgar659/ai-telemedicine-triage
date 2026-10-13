import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Clock, RefreshCcw } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { TriageBadge } from "@/components/TriageBadge";
import { fetchQueue, updateConsultationStatus } from "@/lib/api";
import type { Consultation } from "@/lib/types";

const CLINICIAN_NAME_KEY = "carepath:clinician-name";

export function ClinicianDashboard() {
  const navigate = useNavigate();
  const [queue, setQueue] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Consultation | null>(null);
  const [clinicianName, setClinicianName] = useState(
    () => localStorage.getItem(CLINICIAN_NAME_KEY) ?? ""
  );

  async function loadQueue() {
    setLoading(true);
    try {
      const res = await fetchQueue();
      setQueue(res.consultations);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQueue();
  }, []);

  useEffect(() => {
    localStorage.setItem(CLINICIAN_NAME_KEY, clinicianName);
  }, [clinicianName]);

  async function startConsultation(consultation: Consultation) {
    const name = clinicianName.trim() || "Clinician";
    await updateConsultationStatus(consultation._id, "in_consultation", name);
    navigate(
      `/consultation/${consultation.roomId}?role=clinician&name=${encodeURIComponent(
        name
      )}&consultationId=${consultation._id}`
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Clinician queue</h1>
          <p className="text-muted-foreground">Sorted by AI-assessed urgency, then priority score.</p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Your name"
            value={clinicianName}
            onChange={(event) => setClinicianName(event.target.value)}
            className="w-44"
          />
          <Button variant="outline" size="icon" onClick={loadQueue} aria-label="Refresh queue">
            <RefreshCcw className="size-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="py-16 text-center text-muted-foreground">Loading queue…</p>
      ) : queue.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            No patients waiting right now.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {queue.map((consultation) => (
            <Card
              key={consultation._id}
              className="cursor-pointer border-border/70 transition-colors hover:border-primary/40"
              onClick={() => setSelected(consultation)}
            >
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <TriageBadge level={consultation.triageLevel} />
                    {consultation.status === "in_consultation" && (
                      <span className="text-xs font-medium text-primary">In consultation</span>
                    )}
                  </div>
                  <p className="font-medium">{consultation.patient.fullName}</p>
                  <p className="text-sm text-muted-foreground">{consultation.chiefComplaint}</p>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="size-3.5" />
                    {formatDistanceToNow(new Date(consultation.createdAt), { addSuffix: true })}
                  </span>
                  <span>Priority {consultation.priorityScore}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selected.patient.fullName}
                  <TriageBadge level={selected.triageLevel} />
                </DialogTitle>
                <DialogDescription>{selected.chiefComplaint}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 text-sm">
                <p className="text-muted-foreground">{selected.symptomDescription}</p>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <span>Duration: {selected.durationDays} day(s)</span>
                  <span>Severity: {selected.severity}/10</span>
                  {selected.vitals.spo2Percent && <span>SpO2: {selected.vitals.spo2Percent}%</span>}
                  {selected.vitals.heartRateBpm && <span>HR: {selected.vitals.heartRateBpm} bpm</span>}
                  {selected.vitals.temperatureC && <span>Temp: {selected.vitals.temperatureC}°C</span>}
                </div>

                {selected.patient.allergies.length > 0 && (
                  <p>
                    <span className="font-medium">Allergies: </span>
                    {selected.patient.allergies.join(", ")}
                  </p>
                )}
                {selected.patient.medicalHistory.length > 0 && (
                  <p>
                    <span className="font-medium">History: </span>
                    {selected.patient.medicalHistory.join(", ")}
                  </p>
                )}

                <Separator />

                <div className="space-y-2">
                  <p className="font-medium">AI matches</p>
                  {selected.aiMatches.map((match) => (
                    <div key={match.condition} className="flex items-center justify-between text-xs">
                      <span>{match.condition}</span>
                      <span className="text-muted-foreground">{Math.round(match.score * 100)}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <DialogFooter>
                <Button onClick={() => startConsultation(selected)}>
                  Start consultation
                  <ArrowRight className="size-4" />
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
