import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/SiteHeader";
import { LandingPage } from "@/pages/LandingPage";
import { IntakePage } from "@/pages/IntakePage";
import { TriageResultPage } from "@/pages/TriageResultPage";
import { ClinicianDashboard } from "@/pages/ClinicianDashboard";
import { ConsultationRoom } from "@/pages/ConsultationRoom";

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-svh flex-col bg-background text-foreground">
        <SiteHeader />
        <main className="flex flex-1 flex-col">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/intake" element={<IntakePage />} />
            <Route path="/triage/:consultationId" element={<TriageResultPage />} />
            <Route path="/clinician" element={<ClinicianDashboard />} />
            <Route path="/consultation/:roomId" element={<ConsultationRoom />} />
          </Routes>
        </main>
      </div>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
