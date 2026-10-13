import { Link } from "react-router-dom";
import { ArrowRight, MessagesSquare, ShieldCheck, Sparkles, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI-assisted triage",
    body: "Patient-reported symptoms are embedded and matched against a clinical knowledge base using vector search, surfacing likely conditions and urgency in seconds.",
  },
  {
    icon: Video,
    title: "Browser-based video visits",
    body: "Peer-to-peer WebRTC video connects patients and clinicians directly from the browser — no downloads, no plugins.",
  },
  {
    icon: MessagesSquare,
    title: "Real-time secure chat",
    body: "Socket.io-backed messaging runs alongside every visit for sharing details, instructions, and follow-up notes.",
  },
  {
    icon: ShieldCheck,
    title: "Structured, validated intake",
    body: "Every intake form is validated end-to-end with Zod before it ever reaches the database, keeping patient records clean.",
  },
];

export function LandingPage() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="border-b border-border/70 bg-gradient-to-b from-accent/40 to-transparent">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1.1fr_0.9fr] md:py-24">
          <div className="flex flex-col justify-center gap-6">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              Built for clinic triage teams
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Route every patient to the right level of care, automatically.
            </h1>
            <p className="max-w-xl text-pretty text-muted-foreground">
              Carepath takes a patient's intake and symptom description, matches it against a clinical
              knowledge base with vector search, and queues them for clinicians by urgency — then hands
              off straight into a secure video consultation.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link to="/intake">
                  Start a symptom check
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/clinician">View clinician queue</Link>
              </Button>
            </div>
          </div>
          <Card className="self-center border-border/70 bg-card/80 shadow-sm">
            <CardContent className="grid gap-4 p-6">
              <p className="text-sm font-medium text-muted-foreground">How a visit flows</p>
              {["Patient completes intake", "AI matches symptoms to triage level", "Case enters clinician queue", "Video + chat consultation opens"].map(
                (step, index) => (
                  <div key={step} className="flex items-center gap-3">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {index + 1}
                    </span>
                    <span className="text-sm text-foreground">{step}</span>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {FEATURES.map((feature) => (
          <Card key={feature.title} className="border-border/70">
            <CardContent className="flex flex-col gap-3 p-5">
              <feature.icon className="size-5 text-primary" />
              <h3 className="font-medium">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.body}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
