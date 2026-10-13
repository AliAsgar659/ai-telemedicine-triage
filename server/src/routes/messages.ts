import { Router } from "express";
import { Message } from "../models/Message.js";

export const messagesRouter = Router();

messagesRouter.get("/:roomId", async (req, res, next) => {
  try {
    const messages = await Message.find({ roomId: req.params.roomId }).sort({ createdAt: 1 }).lean();
    res.json({
      messages: messages.map((message) => ({
        id: message._id,
        senderRole: message.senderRole,
        senderName: message.senderName,
        body: message.body,
        createdAt: message.createdAt,
      })),
    });
  } catch (error) {
    next(error);
  }
});
