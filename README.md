# Carepath — AI-Assisted Telemedicine Triage

A clinic triage platform: patients complete a validated intake form, their symptoms are
matched against a clinical knowledge base using vector embeddings, they're queued for
clinicians by urgency, and each case hands off into a real-time video + chat consultation.

## Stack

- **Client**: React 19, Vite, TypeScript, Tailwind CSS v4, shadcn/ui, React Hook Form + Zod
- **Server**: Express, Socket.io, Mongoose (MongoDB), Zod
- **Real-time**: Socket.io for chat + WebRTC signaling; WebRTC (peer-to-peer) for video
- **AI matching**: text embeddings + vector similarity search against a symptom knowledge base

## How symptom matching works

On intake, the patient's chief complaint and symptom description are embedded and compared
against the knowledge base (condition, urgency level, recommended action, specialty) using
vector similarity. The best matches, patient-reported severity, and any abnormal vitals are
combined into a priority score that sorts the clinician queue.

Embedding and vector search providers are configured via environment variables — see
`server/.env.example`. By default the server uses a built-in local embedding so it runs
with zero external dependencies; set `OPENAI_API_KEY` to use OpenAI embeddings, and set
`USE_ATLAS_VECTOR_SEARCH=true` with a MongoDB Atlas connection string and a configured
Atlas Search vector index to run matching as a real `$vectorSearch` aggregation.

If you change embedding providers, re-run `npm run seed` so the knowledge base embeddings
are regenerated with the new provider (matching dimensions/space are required for
meaningful similarity scores).

## Running locally

Requires Node 20+.

```bash
npm install
npm run dev
```

This starts the server on `:4000` and the client on `:5173` concurrently.

By default the server connects to MongoDB at `MONGODB_URI` (see `server/.env.example`).
If no MongoDB instance is reachable, it automatically falls back to a local MongoDB
instance and seeds the knowledge base on boot, so the app runs without any additional
setup. For persistent data, point `MONGODB_URI` at a real local or Atlas instance.

Copy the example env files if you want to customize anything:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

## Project structure

```
server/   Express API, Socket.io signaling/chat, Mongoose models, triage + embedding logic
client/   React app: intake form, triage result, clinician queue, consultation room
```

## Key flows to try

1. **Patient intake** — go to `/intake`, fill out the form (try a chest-pain scenario vs.
   a mild-cold scenario to see different triage levels), submit.
2. **Triage result** — see the AI-matched conditions, urgency level, and recommended
   action; join the consultation room as the patient.
3. **Clinician queue** — go to `/clinician` in a second browser tab, set a clinician name,
   click the waiting case, review the AI matches and vitals, start the consultation.
4. **Consultation room** — both tabs connect via WebRTC (camera/mic permission required)
   with live chat alongside the video.

## Notes

- Clinician identity is currently a name entered on the dashboard, stored in
  `localStorage` — pluggable with a full auth provider.
- WebRTC uses public STUN servers by default; add a TURN server for reliable connectivity
  across restrictive NATs/firewalls in production.
- The symptom knowledge base dataset lives in `server/src/seed/knowledgeBaseData.ts` and
  is designed to be extended with a larger, domain-reviewed clinical reference set.

## Environment variables

See `server/.env.example` and `client/.env.example` for the full list.
