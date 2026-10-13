import type { Server, Socket } from "socket.io";
import { Message } from "../models/Message.js";

interface JoinRoomPayload {
  roomId: string;
  role: "patient" | "clinician";
  name: string;
}

interface ChatMessagePayload {
  roomId: string;
  consultationId: string;
  role: "patient" | "clinician";
  name: string;
  body: string;
}

interface SignalPayload {
  roomId: string;
  to?: string;
  data: unknown;
}

const roomParticipants = new Map<string, Set<string>>();

export function registerSocketHandlers(io: Server) {
  io.on("connection", (socket: Socket) => {
    socket.on("room:join", ({ roomId, role, name }: JoinRoomPayload) => {
      socket.join(roomId);
      socket.data.roomId = roomId;
      socket.data.role = role;
      socket.data.name = name;

      const participants = roomParticipants.get(roomId) ?? new Set<string>();
      participants.add(socket.id);
      roomParticipants.set(roomId, participants);

      socket.to(roomId).emit("room:peer-joined", { socketId: socket.id, role, name });
      socket.emit("room:joined", {
        socketId: socket.id,
        peers: [...participants].filter((id) => id !== socket.id),
      });
    });

    socket.on("chat:message", async (payload: ChatMessagePayload) => {
      try {
        const saved = await Message.create({
          roomId: payload.roomId,
          consultation: payload.consultationId,
          senderRole: payload.role,
          senderName: payload.name,
          body: payload.body,
        });

        io.to(payload.roomId).emit("chat:message", {
          id: saved._id,
          senderRole: saved.senderRole,
          senderName: saved.senderName,
          body: saved.body,
          createdAt: saved.createdAt,
        });
      } catch (error) {
        console.error("Failed to save chat message:", error);
        socket.emit("chat:error", { message: "Your message could not be sent. Please try again." });
      }
    });

    socket.on("webrtc:signal", ({ roomId, to, data }: SignalPayload) => {
      if (to) {
        io.to(to).emit("webrtc:signal", { from: socket.id, data });
      } else {
        socket.to(roomId).emit("webrtc:signal", { from: socket.id, data });
      }
    });

    socket.on("disconnect", () => {
      const roomId = socket.data.roomId as string | undefined;
      if (!roomId) return;

      const participants = roomParticipants.get(roomId);
      participants?.delete(socket.id);
      socket.to(roomId).emit("room:peer-left", { socketId: socket.id });
    });
  });
}
