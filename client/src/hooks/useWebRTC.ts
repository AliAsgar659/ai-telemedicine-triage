import { useEffect, useRef, useState } from "react";
import { getSocket } from "@/lib/socket";

export type CallConnectionState = "idle" | "waiting-for-peer" | "connecting" | "connected" | "disconnected";

interface SignalData {
  type: "offer" | "answer" | "candidate";
  payload: unknown;
}

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [{ urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] }],
};

interface UseWebRtcOptions {
  roomId: string;
  role: "patient" | "clinician";
  name: string;
  enabled: boolean;
}

export function useWebRTC({ roomId, role, name, enabled }: UseWebRtcOptions) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [connectionState, setConnectionState] = useState<CallConnectionState>("idle");
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!enabled || !roomId) return;

    let cancelled = false;
    const socket = getSocket();

    async function setup() {
      setConnectionState("waiting-for-peer");

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      } catch {
        setMediaError("Camera/microphone access was denied or is unavailable.");
        stream = new MediaStream();
      }
      if (cancelled) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      localStreamRef.current = stream;
      setLocalStream(stream);

      const pc = new RTCPeerConnection(ICE_SERVERS);
      pcRef.current = pc;

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      pc.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
        setConnectionState("connected");
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "disconnected" || pc.connectionState === "closed") {
          setConnectionState("disconnected");
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("webrtc:signal", {
            roomId,
            data: { type: "candidate", payload: event.candidate } satisfies SignalData,
          });
        }
      };

      socket.emit("room:join", { roomId, role, name });

      socket.on("room:peer-joined", async () => {
        setConnectionState("connecting");
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("webrtc:signal", {
          roomId,
          data: { type: "offer", payload: offer } satisfies SignalData,
        });
      });

      socket.on("webrtc:signal", async ({ data }: { from: string; data: SignalData }) => {
        if (data.type === "offer") {
          setConnectionState("connecting");
          await pc.setRemoteDescription(new RTCSessionDescription(data.payload as RTCSessionDescriptionInit));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit("webrtc:signal", {
            roomId,
            data: { type: "answer", payload: answer } satisfies SignalData,
          });
        } else if (data.type === "answer") {
          await pc.setRemoteDescription(new RTCSessionDescription(data.payload as RTCSessionDescriptionInit));
        } else if (data.type === "candidate") {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(data.payload as RTCIceCandidateInit));
          } catch {
            // Candidate can arrive before remote description is set; safe to ignore.
          }
        }
      });

      socket.on("room:peer-left", () => {
        setRemoteStream(null);
        setConnectionState("waiting-for-peer");
      });
    }

    setup();

    return () => {
      cancelled = true;
      socket.off("room:peer-joined");
      socket.off("webrtc:signal");
      socket.off("room:peer-left");
      pcRef.current?.close();
      pcRef.current = null;
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
      setLocalStream(null);
      setRemoteStream(null);
      setConnectionState("idle");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, enabled]);

  function toggleMute() {
    const stream = localStreamRef.current;
    if (!stream) return;
    const next = !muted;
    stream.getAudioTracks().forEach((track) => (track.enabled = !next));
    setMuted(next);
  }

  function toggleCamera() {
    const stream = localStreamRef.current;
    if (!stream) return;
    const next = !cameraOff;
    stream.getVideoTracks().forEach((track) => (track.enabled = !next));
    setCameraOff(next);
  }

  return {
    localStream,
    remoteStream,
    connectionState,
    muted,
    cameraOff,
    mediaError,
    toggleMute,
    toggleCamera,
  };
}
