import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getSocket } from "@/lib/socket";
import { fetchMessageHistory } from "@/lib/api";
import type { ChatMessage } from "@/lib/types";

interface UseChatOptions {
  roomId: string;
  consultationId: string;
  role: "patient" | "clinician";
  name: string;
}

export function useChat({ roomId, consultationId, role, name }: UseChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (!roomId) return;
    let cancelled = false;

    fetchMessageHistory(roomId).then((res) => {
      if (!cancelled) setMessages(res.messages);
    });

    const socket = getSocket();
    const onMessage = (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    };
    const onError = ({ message }: { message: string }) => toast.error(message);
    socket.on("chat:message", onMessage);
    socket.on("chat:error", onError);

    return () => {
      cancelled = true;
      socket.off("chat:message", onMessage);
      socket.off("chat:error", onError);
    };
  }, [roomId]);

  function sendMessage(body: string) {
    if (!body.trim()) return;
    const socket = getSocket();
    socket.emit("chat:message", { roomId, consultationId, role, name, body: body.trim() });
  }

  return { messages, sendMessage };
}
