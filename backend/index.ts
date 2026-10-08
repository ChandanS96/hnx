import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

// Demo Endpoints for SENTINEL-X
app.get('/api/alerts', async (req, res) => {
  const alerts = await prisma.alert.findMany();
  res.json(alerts);
});

app.post('/api/alerts', async (req, res) => {
  const alert = await prisma.alert.create({ data: req.body });
  res.json(alert);
});

// Field Reports
app.post('/api/field-reports', async (req, res) => {
  const report = await prisma.fieldReport.create({ data: req.body });
  res.json(report);
});

// Evidence
app.get('/api/evidence', async (req, res) => {
  const evidence = await prisma.evidence.findMany();
  res.json(evidence);
});

// Seed Demo Data Route
app.post('/api/seed', async (req, res) => {
  // Clear existing
  await prisma.alert.deleteMany();
  await prisma.evidence.deleteMany();
  
  // Create Alerts
  await prisma.alert.create({
    data: {
      type: "Heavy Rain",
      severity: "High",
      location: "Mangaluru",
      district: "Dakshina Kannada",
      state: "Karnataka",
      latitude: 12.9141,
      longitude: 74.8560,
      issuedTime: new Date(),
      source: "IMD (Simulated)",
      confidence: 95,
      freshness: "FRESH",
      status: "ACTIVE"
    }
  });

  // Create Evidence
  await prisma.evidence.create({
    data: {
      source: "Field Worker",
      sourceType: "Human",
      timestamp: new Date(),
      latitude: 12.9150,
      longitude: 74.8565,
      confidence: 85,
      reliability: 90,
      freshness: "FRESH",
      claim: "Road B flooded, impassable.",
      status: "VERIFIED"
    }
  });

  res.json({ status: 'seeded' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
