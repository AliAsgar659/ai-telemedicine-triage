import "dotenv/config";

function bool(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return value.toLowerCase() === "true";
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  mongoUri: process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/ai-telemedicine-triage",
  corsOrigin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",

  openaiApiKey: process.env.OPENAI_API_KEY ?? "",
  embeddingModel: process.env.EMBEDDING_MODEL ?? "text-embedding-3-small",

  useAtlasVectorSearch: bool(process.env.USE_ATLAS_VECTOR_SEARCH, false),
  atlasVectorIndexName: process.env.ATLAS_VECTOR_INDEX_NAME ?? "symptom_vector_index",
};

export const hasOpenAiKey = env.openaiApiKey.trim().length > 0;
