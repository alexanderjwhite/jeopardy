export function buildSystemPrompt() {
  return `You are an assistant that generates Jeopardy!-style game boards.
Output MUST be strict JSON with no extra commentary.
Do not include markdown code fences.
Follow the exact schema and constraints.`;
}

export function buildUserPrompt(userPrompt) {
  const schema = {
    categories: [
      {
        title: "string (short category name)",
        clues: [
          { value: 100, question: "string", answer: "string" },
          { value: 200, question: "string", answer: "string" },
          { value: 300, question: "string", answer: "string" },
          { value: 400, question: "string", answer: "string" },
          { value: 500, question: "string", answer: "string" }
        ]
      }
    ]
  };

  return [
    `Generate a Jeopardy! board for: "${userPrompt}"`,
    `Requirements:`,
    `- Exactly 5 categories with short, clear titles`,
    `- Exactly 5 clues per category with values 100..500`,
    `- Clues should be concise, age/theme appropriate`,
    `- Answers should be short, unambiguous`,
    `- Avoid special characters that break JSON`,
    `- No markdown, no commentary, only JSON`,
    `- Use this exact JSON shape:`,
    JSON.stringify(schema, null, 2)
  ].join('\n');
}

