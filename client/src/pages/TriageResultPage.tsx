import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, Loader2, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TriageBadge } from "@/components/TriageBadge";
import { fetchConsultation } from "@/lib/api";
import type { Consultation } from "@/lib/types";

const TRIAGE_COPY: Record<Consultation["triageLevel"], string> = {
  emergency: "This looks like it may need immediate attention. Please consider emergency services if symptoms worsen.",
  urgent: "This looks like it should be seen soon. You're being queued for a same-day consultation.",
  routine: "This looks non-urgent. You're in the queue for the next available clinician.",
};

export function TriageResultPage() {
  const { consultationId } = useParams<{ consultationId: string }>();
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!consultationId) return;
    fetchConsultation(consultationId)
      .then((res) => setConsultation(res.consultation))
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load your result"))
      .finally(() => setLoading(false));
  }, [consultationId]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="mr-2 size-4 animate-spin" />
        Matching your symptoms against our knowledge base…
      </div>
    );
  }

  if (error || !consultation) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="text-destructive">{error ?? "Consultation not found."}</p>
        <Button asChild className="mt-4">
          <Link to="/intake">Start over</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
      <Card className="border-border/70">
        <CardHeader className="gap-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Triage result for {consultation.patient.fullName}</CardTitle>
            <TriageBadge level={consultation.triageLevel} />
          </div>
          <CardDescription>{TRIAGE_COPY[consultation.triageLevel]}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Reported</p>
            <p className="mt-1 text-sm">{consultation.chiefComplaint}</p>
          </div>

          <Separator />

          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">AI-matched possibilities</p>
            {consultation.aiMatches.map((match) => (
              <div key={match.condition} className="rounded-lg border border-border/70 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <Stethoscope className="size-4 text-primary" />
                    {match.condition}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(match.score * 100)}% match · {match.specialty}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{match.recommendedAction}</p>
              </div>
            ))}
          </div>

          <Separator />

          <div className="rounded-lg bg-muted/60 p-4">
            <p className="text-sm font-medium">Next step</p>
            <p className="mt-1 text-sm text-muted-foreground">
              You've been added to the clinician queue. Join the consultation room now — a clinician will
              connect with you by video and chat as soon as they pick up your case.
            </p>
            <Button asChild className="mt-3">
              <Link
                to={`/consultation/${consultation.roomId}?role=patient&name=${encodeURIComponent(
                  consultation.patient.fullName
                )}&consultationId=${consultation._id}`}
              >
                Join consultation room
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
