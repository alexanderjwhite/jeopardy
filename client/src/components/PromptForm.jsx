import React, { useState } from 'react';

export default function PromptForm({ onSubmit, loading, initialPrompt }) {
  const [prompt, setPrompt] = useState(initialPrompt || 'Create a fourth grade family Jeopardy!');
  const submit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onSubmit(prompt.trim());
  };
  return (
    <form className="prompt-form" onSubmit={submit}>
      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter a theme or grade level..."
        disabled={loading}
        aria-disabled={loading}
      />
      <button type="submit" disabled={loading} aria-busy={loading} aria-live="polite">
        {loading ? (<><span className="spinner" aria-hidden="true"></span>Generating…</>) : 'Generate Game'}
      </button>
    </form>
  );
}
