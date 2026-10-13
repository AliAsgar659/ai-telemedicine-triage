import mongoose from "mongoose";
import { connectDb } from "../config/db.js";
import { SymptomEntry } from "../models/SymptomEntry.js";
import { currentEmbeddingProvider, getEmbedding } from "../services/embeddings.js";
import { knowledgeBaseSeedData } from "./knowledgeBaseData.js";

export async function seedKnowledgeBase(): Promise<void> {
  const provider = currentEmbeddingProvider();
  console.log(`Embedding provider: ${provider}`);

  await SymptomEntry.deleteMany({});

  for (const entry of knowledgeBaseSeedData) {
    const embeddingText = [entry.condition, entry.description, entry.sampleSymptoms.join(", ")].join(". ");
    const embedding = await getEmbedding(embeddingText);

    await SymptomEntry.create({
      ...entry,
      embedding,
      embeddingProvider: provider,
    });
    console.log(`Seeded: ${entry.condition}`);
  }

  console.log(`Done. Seeded ${knowledgeBaseSeedData.length} knowledge base entries.`);
}

const isMain = process.argv[1] && import.meta.url === `file://${process.argv[1]}`;

if (isMain) {
  connectDb()
    .then(seedKnowledgeBase)
    .then(() => mongoose.disconnect())
    .catch((error) => {
      console.error("Seed failed:", error);
      process.exit(1);
    });
}
