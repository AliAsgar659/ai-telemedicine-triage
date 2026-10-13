import http from "node:http";
import cors from "cors";
import express from "express";
import { Server } from "socket.io";
import { env } from "./config/env.js";
import { connectDb } from "./config/db.js";
import { currentEmbeddingProvider } from "./services/embeddings.js";
import { intakeRouter } from "./routes/intake.js";
import { consultationsRouter } from "./routes/consultations.js";
import { messagesRouter } from "./routes/messages.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { registerSocketHandlers } from "./sockets/index.js";
import { SymptomEntry } from "./models/SymptomEntry.js";
import { seedKnowledgeBase } from "./seed/seedKnowledgeBase.js";

async function main() {
  await connectDb();
  console.log(`Embedding provider: ${currentEmbeddingProvider()}`);
  console.log(`Vector search mode: ${env.useAtlasVectorSearch ? "Atlas $vectorSearch" : "local cosine similarity"}`);

  if ((await SymptomEntry.countDocuments()) === 0) {
    console.log("Symptom knowledge base is empty — seeding it now…");
    await seedKnowledgeBase();
  }

  const app = express();
  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      embeddingProvider: currentEmbeddingProvider(),
      vectorSearchMode: env.useAtlasVectorSearch ? "atlas" : "local",
    });
  });

  app.use("/api/intake", intakeRouter);
  app.use("/api/consultations", consultationsRouter);
  app.use("/api/messages", messagesRouter);

  app.use(errorHandler);

  const httpServer = http.createServer(app);
  const io = new Server(httpServer, { cors: { origin: env.corsOrigin } });
  registerSocketHandlers(io);

  httpServer.listen(env.port, () => {
    console.log(`Server listening on http://localhost:${env.port}`);
  });
}

main().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
