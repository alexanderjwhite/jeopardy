import React, { useState } from 'react';

export default function Scoreboard({ state, setState }) {
  const { players = [] } = state;
  const [newName, setNewName] = useState('');

  function addPlayer() {
    const name = newName.trim();
    if (!name) return;
    setState((s) => ({ ...s, players: [...(s.players||[]), { id: crypto.randomUUID(), name, score: 0 }] }));
    setNewName('');
  }

  function updateScore(id, delta) {
    setState((s) => ({
      ...s,
      players: (s.players||[]).map(p => p.id === id ? { ...p, score: p.score + delta } : p)
    }));
  }

  function updateName(id, name) {
    setState((s) => ({
      ...s,
      players: (s.players||[]).map(p => p.id === id ? { ...p, name } : p)
    }));
  }

  function removePlayer(id) {
    setState((s) => ({
      ...s,
      players: (s.players||[]).filter(p => p.id !== id)
    }));
  }

  return (
    <div className="scoreboard">
      <div className="players">
        {(players||[]).map(p => (
          <div key={p.id} className="player">
            <input value={p.name} onChange={(e) => updateName(p.id, e.target.value)} />
            <span className="chip">{`$${p.score}`}</span>
            <button className="icon-btn" onClick={() => updateScore(p.id, +100)}>+100</button>
            <button className="icon-btn" onClick={() => updateScore(p.id, -100)}>-100</button>
            <button className="icon-btn ghost" onClick={() => removePlayer(p.id)}>Remove</button>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
        <input
          placeholder="Add player name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button className="secondary" onClick={addPlayer}>Add Player</button>
      </div>
    </div>
  );
}
