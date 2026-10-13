import { useEffect, useRef } from "react";
import { VideoOff } from "lucide-react";

interface VideoTileProps {
  stream: MediaStream | null;
  muted?: boolean;
  label: string;
  placeholder?: string;
}

export function VideoTile({ stream, muted, label, placeholder }: VideoTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-900">
      {stream ? (
        <video ref={videoRef} autoPlay playsInline muted={muted} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-400">
          <VideoOff className="size-6" />
          <p className="text-xs">{placeholder ?? "Waiting for video…"}</p>
        </div>
      )}
      <span className="absolute bottom-2 left-2 rounded-md bg-black/50 px-2 py-0.5 text-xs text-white">
        {label}
      </span>
    </div>
  );
}
