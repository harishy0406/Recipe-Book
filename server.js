require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
// Serve static frontend files from repo root
app.use(express.static('.'));
// Simple /api/generate endpoint that supports Google Generative API (GEMINI_API_KEY)
// or OpenAI (OPENAI_API_KEY) as a fallback. Set one of the env vars on the server.
app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body || {};
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

  try {
    // Prefer Google Gemini style endpoint if key provided
    if (process.env.GEMINI_API_KEY) {
      const key = process.env.GEMINI_API_KEY;
      const url = `https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generate?key=${key}`;
      const body = {
        prompt: { text: prompt },
        temperature: 0.7,
        maxOutputTokens: 800
      };

      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await r.json();
      const reply = data?.candidates?.[0]?.content || data?.candidates?.[0] || JSON.stringify(data);
      return res.json({ reply: typeof reply === 'string' ? reply : JSON.stringify(reply) });
    }

    // Fallback: OpenAI if available
    if (process.env.OPENAI_API_KEY) {
      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 800
        })
      });

      const data = await r.json();
      const reply = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || JSON.stringify(data);
      return res.json({ reply });
    }

    return res.status(500).json({ error: 'No server API key configured. Set GEMINI_API_KEY or OPENAI_API_KEY.' });
  } catch (err) {
    console.error('Generation error:', err);
    return res.status(500).json({ error: err.message || 'Generation failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
