# Carepath — AI-Assisted Telemedicine Triage

A full-stack prototype of a clinic triage platform: patients complete a validated intake
form, their symptoms are matched against a clinical knowledge base using vector
embeddings, they're queued for clinicians by urgency, and each case hands off into a
real-time video + chat consultation.

## Stack

- **Client**: React 19, Vite, TypeScript, Tailwind CSS v4, shadcn/ui, React Hook Form + Zod
- **Server**: Express, Socket.io, Mongoose (MongoDB), Zod
- **Real-time**: Socket.io for chat + WebRTC signaling; WebRTC (peer-to-peer) for video
- **AI matching**: text embeddings + vector similarity search against a seeded symptom
  knowledge base

## How symptom matching works

On intake, the patient's chief complaint + symptom description is embedded and compared
against ~24 seeded knowledge-base entries (condition, urgency level, recommended action,
specialty) using cosine similarity. The best matches, patient-reported severity, and any
abnormal vitals are combined into a priority score that sorts the clinician queue.

**This works out of the box with zero external services**, using a deterministic local
hashing-based embedding. Drop a real `OPENAI_API_KEY` into `server/.env` and it
automatically switches to real OpenAI embeddings — no code changes needed. Likewise,
setting `USE_ATLAS_VECTOR_SEARCH=true` with a MongoDB Atlas connection string and a
configured Atlas Search vector index switches symptom matching from in-process cosine
similarity to a real `$vectorSearch` aggregation.

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

**No MongoDB install required for local dev.** If `server/.env`'s `MONGODB_URI` isn't
reachable (the default on a fresh checkout), the server automatically falls back to an
ephemeral in-memory MongoDB instance and seeds it on boot. Data does not persist across
restarts in this mode — set `MONGODB_URI` to a real local or Atlas instance to persist
data (see `server/.env.example`).

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

## What's mocked / simplified

- No authentication — clinician identity is just a name typed into the dashboard, stored
  in `localStorage`.
- The symptom knowledge base is a seeded, illustrative dataset (`server/src/seed/knowledgeBaseData.ts`),
  not a real clinical reference.
- WebRTC uses public Google STUN servers only — no TURN server, so calls across
  restrictive NATs/firewalls may not connect (fine for same-network/local demos).
- Patient/clinician roles in a consultation room are determined by a `role` query param,
  not a real session.

## Environment variables

See `server/.env.example` and `client/.env.example` for the full list. Nothing is
required to run locally — all external integrations (OpenAI embeddings, Atlas Vector
Search) are optional and pluggable.
