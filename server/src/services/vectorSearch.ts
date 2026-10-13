import { env } from "../config/env.js";
import { SymptomEntry, SymptomEntryDoc } from "../models/SymptomEntry.js";
import { currentEmbeddingProvider } from "./embeddings.js";

export interface KnowledgeBaseMatch {
  condition: string;
  description: string;
  urgencyLevel: SymptomEntryDoc["urgencyLevel"];
  recommendedAction: string;
  specialty: string;
  score: number;
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  return denom === 0 ? 0 : dot / denom;
}

/**
 * Finds the closest knowledge-base entries for a symptom embedding.
 *
 * When USE_ATLAS_VECTOR_SEARCH=true and ATLAS_VECTOR_INDEX_NAME points at a
 * configured Atlas Search vector index, this runs a real $vectorSearch
 * aggregation. Otherwise it falls back to in-process cosine similarity over
 * the (small) seeded knowledge base, so symptom matching works against any
 * MongoDB instance, including a local one, with no Atlas dependency.
 */
export async function matchSymptoms(
  queryEmbedding: number[],
  limit = 3
): Promise<KnowledgeBaseMatch[]> {
  if (env.useAtlasVectorSearch) {
    const results = await SymptomEntry.aggregate([
      {
        $vectorSearch: {
          index: env.atlasVectorIndexName,
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 100,
          limit,
        },
      },
      {
        $project: {
          condition: 1,
          description: 1,
          urgencyLevel: 1,
          recommendedAction: 1,
          specialty: 1,
          score: { $meta: "vectorSearchScore" },
        },
      },
    ]);
    return results as KnowledgeBaseMatch[];
  }

  const provider = currentEmbeddingProvider();
  const entries = await SymptomEntry.find({ embeddingProvider: provider }).lean();

  return entries
    .map((entry) => ({
      condition: entry.condition,
      description: entry.description,
      urgencyLevel: entry.urgencyLevel,
      recommendedAction: entry.recommendedAction,
      specialty: entry.specialty,
      score: cosineSimilarity(queryEmbedding, entry.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
