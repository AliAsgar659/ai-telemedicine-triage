import { env, hasOpenAiKey } from "../config/env.js";

export const LOCAL_EMBEDDING_DIMS = 256;
export const OPENAI_EMBEDDING_DIMS = 1536;

export type EmbeddingProvider = "openai" | "local-hashing";

export function currentEmbeddingProvider(): EmbeddingProvider {
  return hasOpenAiKey ? "openai" : "local-hashing";
}

export function currentEmbeddingDims(): number {
  return hasOpenAiKey ? OPENAI_EMBEDDING_DIMS : LOCAL_EMBEDDING_DIMS;
}

/**
 * Deterministic bag-of-words hashing embedding so symptom matching works
 * fully offline when no OPENAI_API_KEY is configured. Swapping in a real
 * key switches getEmbedding() to OpenAI with no other code changes.
 */
function localHashingEmbedding(text: string): number[] {
  const vector = new Array(LOCAL_EMBEDDING_DIMS).fill(0);
  const tokens = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  for (const token of tokens) {
    let hash = 0;
    for (let i = 0; i < token.length; i++) {
      hash = (hash * 31 + token.charCodeAt(i)) >>> 0;
    }
    const index = hash % LOCAL_EMBEDDING_DIMS;
    vector[index] += 1;

    // Also hash bigrams of adjacent characters to capture partial/typo overlap.
    const bigramHashIndex = (hash >>> 3) % LOCAL_EMBEDDING_DIMS;
    vector[bigramHashIndex] += 0.5;
  }

  const magnitude = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0)) || 1;
  return vector.map((v) => v / magnitude);
}

async function openAiEmbedding(text: string): Promise<number[]> {
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.openaiApiKey}`,
    },
    body: JSON.stringify({ model: env.embeddingModel, input: text }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenAI embeddings request failed (${response.status}): ${body}`);
  }

  const data = (await response.json()) as { data: { embedding: number[] }[] };
  return data.data[0].embedding;
}

export async function getEmbedding(text: string): Promise<number[]> {
  if (hasOpenAiKey) {
    return openAiEmbedding(text);
  }
  return localHashingEmbedding(text);
}
