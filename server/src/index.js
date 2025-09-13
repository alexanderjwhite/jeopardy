import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateBoard } from './generateBoard.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body || {};
  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  try {
    const board = await generateBoard(prompt.trim());
    res.json(board);
  } catch (e) {
    res.status(500).json({ error: 'Failed to generate board' });
  }
});

const PORT = Number(process.env.PORT || 3001);
app.listen(PORT, () => {
  console.log(`Jeopardy server listening on http://localhost:${PORT}`);
});

