import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoTile } from "@/components/VideoTile";
import { ChatPanel } from "@/components/ChatPanel";
import { useWebRTC } from "@/hooks/useWebRTC";
import { useChat } from "@/hooks/useChat";
import { updateConsultationStatus } from "@/lib/api";

const CONNECTION_LABEL: Record<string, string> = {
  idle: "Starting…",
  "waiting-for-peer": "Waiting for the other participant to join…",
  connecting: "Connecting…",
  connected: "Connected",
  disconnected: "Call ended",
};

export function ConsultationRoom() {
  const { roomId = "" } = useParams<{ roomId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const role = (searchParams.get("role") === "clinician" ? "clinician" : "patient") as
    | "patient"
    | "clinician";
  const name = searchParams.get("name") || (role === "clinician" ? "Clinician" : "Patient");
  const consultationId = searchParams.get("consultationId") || "";
  const [ended, setEnded] = useState(false);

  const {
    localStream,
    remoteStream,
    connectionState,
    muted,
    cameraOff,
    mediaError,
    toggleMute,
    toggleCamera,
  } = useWebRTC({ roomId, role, name, enabled: !ended });

  const { messages, sendMessage } = useChat({ roomId, consultationId, role, name });

  async function endCall() {
    setEnded(true);
    if (role === "clinician" && consultationId) {
      try {
        await updateConsultationStatus(consultationId, "completed", name);
      } catch {
        // Non-critical — the clinician can still navigate away.
      }
      navigate("/clinician");
    } else {
      navigate("/");
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-6 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Consultation room</h1>
          <p className="text-sm text-muted-foreground">{CONNECTION_LABEL[connectionState]}</p>
        </div>
        <Button variant="destructive" onClick={endCall}>
          <PhoneOff className="size-4" />
          End
        </Button>
      </div>

      {mediaError && (
        <p className="rounded-md bg-urgency-urgent-bg px-3 py-2 text-sm text-urgency-urgent">{mediaError}</p>
      )}

      <div className="grid flex-1 gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          <VideoTile stream={remoteStream} label={role === "clinician" ? "Patient" : "Clinician"} />
          <VideoTile stream={localStream} muted label={`${name} (you)`} />
        </div>
        <div className="min-h-[360px]">
          <ChatPanel messages={messages} onSend={sendMessage} currentRole={role} />
        </div>
      </div>

      <div className="flex justify-center gap-3">
        <Button variant="outline" size="icon" onClick={toggleMute} aria-label="Toggle microphone">
          {muted ? <MicOff className="size-4" /> : <Mic className="size-4" />}
        </Button>
        <Button variant="outline" size="icon" onClick={toggleCamera} aria-label="Toggle camera">
          {cameraOff ? <VideoOff className="size-4" /> : <Video className="size-4" />}
        </Button>
      </div>
    </div>
  );
}
