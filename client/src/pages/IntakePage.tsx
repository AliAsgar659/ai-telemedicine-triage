import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { intakeFormSchema, type IntakeFormValues } from "@/lib/schemas";
import { submitIntake } from "@/lib/api";

const DEFAULT_VALUES: IntakeFormValues = {
  fullName: "",
  dateOfBirth: "",
  sex: "prefer_not_to_say",
  contactPhone: "",
  contactEmail: "",
  medicalHistory: "",
  currentMedications: "",
  allergies: "",
  chiefComplaint: "",
  symptomDescription: "",
  durationDays: 1,
  severity: 5,
  vitals: {},
};

export function IntakePage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<IntakeFormValues>({
    // zod's generated resolver type and react-hook-form's expected Resolver
    // type are structurally identical here but get loaded as separate
    // instantiations by the TS compiler, so they report as "unrelated".
    resolver: zodResolver(intakeFormSchema) as unknown as Resolver<IntakeFormValues>,
    defaultValues: DEFAULT_VALUES,
  });

  async function onSubmit(values: IntakeFormValues) {
    setSubmitting(true);
    try {
      const result = await submitIntake(values);
      toast.success("Intake received — matching your symptoms now.");
      navigate(`/triage/${result.consultationId}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong submitting your intake.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-8 space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Symptom check-in</h1>
        <p className="text-muted-foreground">
          Tell us what's going on. Our triage assistant will match your symptoms to likely conditions
          and route you to the right level of care.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your details</CardTitle>
              <CardDescription>Used to identify you and reach you if needed.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jordan Alvarez" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sex</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone number</FormLabel>
                    <FormControl>
                      <Input placeholder="(555) 201-4471" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="jordan@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Medical background</CardTitle>
              <CardDescription>Separate multiple entries with commas. Leave blank if none.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="medicalHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Existing conditions</FormLabel>
                    <FormControl>
                      <Input placeholder="Type 2 diabetes, hypertension" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currentMedications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current medications</FormLabel>
                    <FormControl>
                      <Input placeholder="Metformin 500mg, lisinopril 10mg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="allergies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allergies</FormLabel>
                    <FormControl>
                      <Input placeholder="Penicillin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What's going on today</CardTitle>
              <CardDescription>
                Describe your symptoms as specifically as you can — this is what our AI matches against.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="chiefComplaint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Main reason for this visit</FormLabel>
                    <FormControl>
                      <Input placeholder="Chest pain that started this morning" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="symptomDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Symptom details</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        placeholder="Describe location, severity, what makes it better or worse, and anything else relevant."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="durationDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>How many days has this lasted?</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} step="0.5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="severity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Severity — {field.value}/10</FormLabel>
                      <FormControl>
                        <Slider
                          min={1}
                          max={10}
                          step={1}
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                        />
                      </FormControl>
                      <FormDescription>1 = barely noticeable, 10 = worst imaginable</FormDescription>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vitals (optional)</CardTitle>
              <CardDescription>If you have a thermometer, pulse oximeter, or BP cuff handy.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="vitals.temperatureC"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temperature (°C)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="37.0" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vitals.heartRateBpm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heart rate (bpm)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="78" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vitals.spo2Percent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood oxygen (%)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="98" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vitals.bloodPressureSystolic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>BP systolic</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="120" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vitals.bloodPressureDiastolic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>BP diastolic</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="80" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={submitting}>
            {submitting ? "Matching symptoms…" : "Submit and get triaged"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
