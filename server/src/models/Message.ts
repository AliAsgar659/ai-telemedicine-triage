import { Schema, model, Types } from "mongoose";

export interface MessageDoc {
  roomId: string;
  consultation: Types.ObjectId;
  senderRole: "patient" | "clinician";
  senderName: string;
  body: string;
  createdAt: Date;
}

const messageSchema = new Schema<MessageDoc>(
  {
    roomId: { type: String, required: true, index: true },
    consultation: { type: Schema.Types.ObjectId, ref: "Consultation", required: true },
    senderRole: { type: String, enum: ["patient", "clinician"], required: true },
    senderName: { type: String, required: true },
    body: { type: String, required: true },
  },
  { timestamps: true }
);

export const Message = model<MessageDoc>("Message", messageSchema);
