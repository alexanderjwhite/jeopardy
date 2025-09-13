import dotenv from 'dotenv';
dotenv.config();

let OpenAIConstructor = null;
try {
  // Lazy optional import; if not installed, fallback path remains
  const mod = await import('openai');
  OpenAIConstructor = mod.default;
} catch (_) {
  // no-op; will use fallback
}

export function createOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!OpenAIConstructor || !apiKey) return null;
  return new OpenAIConstructor({ apiKey });
}

