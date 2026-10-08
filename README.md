# SENTINEL-X: Disaster Intelligence & Response Safety Platform

"From Alerts to Safer Decisions."

This is a full-stack hackathon prototype featuring deterministic simulated intelligence, a working Command Center, AI Safety Gate, and interactive Judge Mode.

## Prerequisites
- Node.js (v18+)
- PostgreSQL (ensure a local instance is running, or modify backend/.env to point to your DB)

## 1. Setup Backend
```bash
cd backend
npm install
npx prisma db push
npm run start
```
*(Note: To run the backend, we use `npx ts-node index.ts`. Add a start script to package.json if needed: `"start": "ts-node index.ts"`)*

Once the backend starts, hit the seed endpoint to load the demo data:
```bash
curl -X POST http://localhost:3001/api/seed
```

## 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Features Implemented:
- **Landing Page**: Premium UI with dynamic animations.
- **Command Center**: Leaflet-based Live Map with reverse-geocoded markers and browser geolocation.
- **Safety Gate**: AI Critic vs AI Planner logic, Evidence Engine freshness and conflict detection.
- **Judge Mode**: Interactive control panel to trigger the Disaster Cascade Simulator (Flood levels, Conflict injection, Stale evidence, Blind spots).

> **Important**: This is a prototype designed for demonstration. The intelligence is deterministic and runs locally to ensure it works perfectly without paid API keys during a live demo.
