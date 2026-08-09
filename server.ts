import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI client on server side
  const getGeminiAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // API Route: AI Tutor Explanation & Hints
  app.post('/api/ai/explain', async (req, res) => {
    try {
      const { equation, currentCoefficients, question } = req.body;
      const ai = getGeminiAI();

      if (!ai) {
        return res.status(503).json({
          error: 'Gemini API Key is not configured. Please add GEMINI_API_KEY in secrets.',
          fallbackHint: 'Count the atoms of each element on both sides of the reaction arrow! Tip: Start with elements that appear in only one molecule on each side.'
        });
      }

      const prompt = `You are an expert high school chemistry tutor helping a student balance a chemical equation.
Equation: ${equation}
Student's current coefficients: ${JSON.stringify(currentCoefficients)}
Student Question or context: ${question || 'Explain how to balance this equation step-by-step with clear instructions, conservation of mass principles, and visual counting tips.'}

Provide a friendly, encouraging, and clear explanation formatted with Markdown. Highlighting atom counts for reactants vs products. Keep it concise yet thorough!`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
      });

      res.json({ explanation: response.text });
    } catch (error: any) {
      console.error('Error generating AI explanation:', error);
      res.status(500).json({ error: error.message || 'Failed to generate explanation' });
    }
  });

  // API Route: AI Custom Chemical Reaction Generator
  app.post('/api/ai/generate-reaction', async (req, res) => {
    try {
      const { difficulty, topic } = req.body;
      const ai = getGeminiAI();

      if (!ai) {
        return res.status(503).json({
          error: 'Gemini API key missing',
          fallback: {
            title: 'Photosynthesis Reaction',
            equationStr: 'CO2 + H2O -> C6H12O6 + O2',
            reactants: [
              { formula: 'CO2', name: 'Carbon Dioxide', atoms: { C: 1, O: 2 } },
              { formula: 'H2O', name: 'Water', atoms: { H: 2, O: 1 } }
            ],
            products: [
              { formula: 'C6H12O6', name: 'Glucose', atoms: { C: 6, H: 12, O: 6 } },
              { formula: 'O2', name: 'Oxygen Gas', atoms: { O: 2 } }
            ],
            solutionCoefficients: { reactants: [6, 6], products: [1, 6] },
            difficulty: 'Medium',
            category: 'Biology/Photosynthesis',
            explanation: '6 CO2 + 6 H2O -> C6H12O6 + 6 O2. Carbon: 6=6, Hydrogen: 12=12, Oxygen: 18=18.'
          }
        });
      }

      const prompt = `Generate a chemical equation problem for high school chemistry students.
Difficulty: ${difficulty || 'Medium'}
Category/Topic: ${topic || 'General Chemistry'}

Return ONLY a valid JSON object matching this TypeScript format:
{
  "title": "Short Descriptive Title",
  "equationStr": "A + B -> C + D",
  "reactants": [
    { "formula": "CO2", "name": "Carbon Dioxide", "atoms": { "C": 1, "O": 2 } }
  ],
  "products": [
    { "formula": "C6H12O6", "name": "Glucose", "atoms": { "C": 6, "H": 12, "O": 6 } }
  ],
  "solutionCoefficients": { "reactants": [6, 6], "products": [1, 6] },
  "difficulty": "${difficulty || 'Medium'}",
  "category": "${topic || 'General Chemistry'}",
  "explanation": "Step by step solution..."
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const reactionData = JSON.parse(response.text || '{}');
      res.json(reactionData);
    } catch (error: any) {
      console.error('Error generating reaction:', error);
      res.status(500).json({ error: 'Failed to generate custom reaction' });
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Serve static assets or Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ChemBalance Pro server running on http://localhost:${PORT}`);
  });
}

startServer();
