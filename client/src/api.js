const BASE = (import.meta.env && import.meta.env.VITE_API_URL ? String(import.meta.env.VITE_API_URL) : '').replace(/\/$/, '');

export async function generateBoard(prompt) {
  const url = `${BASE}/api/generate`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Generate failed: ${res.status} ${text}`);
  }
  return res.json();
}
