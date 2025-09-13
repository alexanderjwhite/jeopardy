import { createOpenAI } from './openaiClient.js';
import { buildSystemPrompt, buildUserPrompt } from './prompt.js';
import { validateBoard } from './schema.js';
import { generateFallbackBoard } from './fallback.js';

export async function generateBoard(userPrompt) {
  const useOpenAI = String(process.env.USE_OPENAI || 'true').toLowerCase() === 'true';
  const client = useOpenAI ? createOpenAI() : null;
  const model = process.env.MODEL || 'gpt-4o-mini';

  // Fallback fast path if no client
  if (!client) {
    const fb = generateFallbackBoard(userPrompt);
    return fb;
  }

  const system = buildSystemPrompt();
  const user = buildUserPrompt(userPrompt);

  try {
    const resp = await client.chat.completions.create({
      model,
      temperature: 0.7,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ]
    });

    const content = resp.choices?.[0]?.message?.content?.trim() || '';
    const withoutFences = content.replace(/^```json\n?|```$/g, '').trim();
    const parsed = JSON.parse(withoutFences);
    const result = validateBoard(parsed);
    if (!result.success) {
      // Validation failed; use fallback but prefer categories from model if possible
      return generateFallbackBoard(userPrompt);
    }
    return result.data;
  } catch (err) {
    // Any error → safe fallback
    return generateFallbackBoard(userPrompt);
  }
}

