import crypto from 'node:crypto';

const DOLLARS = [100, 200, 300, 400, 500];

function seededRandom(seed) {
  let h = crypto.createHash('sha256').update(seed).digest();
  let i = 0;
  return () => {
    if (i + 4 > h.length) {
      h = crypto.createHash('sha256').update(h).digest();
      i = 0;
    }
    const n = h.readUInt32BE(i);
    i += 4;
    return n / 0xffffffff;
  };
}

export function generateFallbackBoard(userPrompt) {
  const rand = seededRandom(userPrompt || 'fallback');
  const topics = [
    'Animals', 'Science', 'History', 'Geography', 'Sports',
    'Literature', 'Music', 'Movies', 'Space', 'Art', 'Food', 'Nature'
  ];
  const chosen = [];
  while (chosen.length < 5) {
    const t = topics[Math.floor(rand() * topics.length)];
    if (!chosen.includes(t)) chosen.push(t);
  }

  const categories = chosen.map((title, ci) => ({
    title: `${title}`,
    clues: DOLLARS.map((value, qi) => ({
      value,
      question: `(${value}) ${title}: A simple question related to "${userPrompt || 'general knowledge'}".`,
      answer: `${title} fact ${qi + 1}`
    }))
  }));

  return { categories };
}

