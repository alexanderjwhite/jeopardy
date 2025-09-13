# Simple Jeopardy! Web Application

MVP single-session Jeopardy-style game per the PRD. React frontend, Express backend, optional OpenAI generation with a safe local fallback.

## Stack
- Frontend: Vite + React
- Backend: Node.js + Express
- AI: OpenAI Chat Completions (JSON response), with deterministic fallback if API is unavailable

## Quick Start

1) Backend
- Copy `server/.env.example` to `server/.env` and set `OPENAI_API_KEY`.
- Optional: set `USE_OPENAI=false` to force fallback generation.
- Install deps and start:
```
cd server
npm install
npm run dev
```
Server runs on `http://localhost:3001`.

2) Frontend
```
cd client
npm install
npm run dev
```
Frontend runs on `http://localhost:5173` with a dev proxy to the backend.

## Usage
- Enter a natural-language prompt (e.g., "Create a fourth grade family Jeopardy!") and click Generate Game.
- A 5×5 board appears. Click a dollar tile to reveal the question in a modal; the tile becomes unavailable.
- Optional scoreboard lets you add players and +/- 100 points. State is stored locally in your browser.
- Use Reset Used Tiles to flip tiles back; or Reset Board + Scores to start fresh.

## API
POST `/api/generate`
Body: `{ "prompt": string }`
Response:
```
{
  "categories": [
    {
      "title": "string",
      "clues": [
        { "value": 100, "question": "string", "answer": "string" },
        { "value": 200, "question": "string", "answer": "string" },
        { "value": 300, "question": "string", "answer": "string" },
        { "value": 400, "question": "string", "answer": "string" },
        { "value": 500, "question": "string", "answer": "string" }
      ]
    }
  ]
}
```

## Notes
- If `OPENAI_API_KEY` is missing or the request fails, the backend returns a seeded fallback board derived from the prompt (keeps the app usable offline).
- The OpenAI prompt template requests strict JSON (no markdown) and is validated server-side.
- This code focuses on MVP gameplay mechanics and a simple UI per the PRD.

