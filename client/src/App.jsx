import React, { useEffect, useMemo, useState } from 'react';
import PromptForm from './components/PromptForm.jsx';
import Board from './components/Board.jsx';
import Modal from './components/Modal.jsx';
import Scoreboard from './components/Scoreboard.jsx';
import { generateBoard } from './api.js';

const STORAGE_KEY = 'jeopardy-state-v1';

function loadState() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
}
function saveState(s) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

export default function App() {
  const [state, setState] = useState(() => loadState());
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null); // {col,row,clue}
  const [showAnswer, setShowAnswer] = useState(false);

  // Persist state
  useEffect(() => { saveState(state); }, [state]);

  const usedSet = useMemo(() => new Set(state.usedKeys || []), [state.usedKeys]);

  async function onGenerate(prompt) {
    setLoading(true);
    try {
      const board = await generateBoard(prompt);
      setState({ prompt, board, usedKeys: [], players: state.players || [] });
    } catch (e) {
      alert(e.message || 'Failed to generate');
    } finally {
      setLoading(false);
    }
  }

  function onTileClick(col, row, clue) {
    const key = `${col}-${row}`;
    if (usedSet.has(key)) return;
    // mark used and open modal
    setState((s) => ({ ...s, usedKeys: [...(s.usedKeys||[]), key] }));
    setShowAnswer(false);
    setModal({ col, row, clue });
  }

  function resetGame() {
    if (!confirm('Reset board and scores?')) return;
    setState({ prompt: state.prompt, players: [] });
    setModal(null);
  }

  function resetBoardOnly() {
    setState((s) => ({ ...s, usedKeys: [], board: s.board }));
  }

  return (
    <div className="container">
      {loading && (
        <div className="loading-overlay" role="status" aria-live="assertive">
          <div className="loading-card">
            <span className="spinner lg" aria-hidden="true"></span>
            <div>Generating game…</div>
          </div>
        </div>
      )}
      <div className="header">
        <div>
          <div className="title">Simple Jeopardy!</div>
          <div style={{ color: '#c5d2ff', fontSize: 12 }}>
            {state.prompt ? `Theme: ${state.prompt}` : 'Enter a prompt to generate a board'}
          </div>
        </div>
        <div className="actions" style={{ width: '100%' }}>
          <PromptForm onSubmit={onGenerate} loading={loading} initialPrompt={state.prompt} />
        </div>
      </div>

      {state.board ? (
        <>
          <div className="board-wrap">
            <Board board={state.board} usedSet={usedSet} onTileClick={onTileClick} />
          </div>
          <div className="actions" style={{ marginTop: 10 }}>
            <button className="secondary" onClick={resetBoardOnly}>Reset Used Tiles</button>
            <button className="secondary" onClick={resetGame}>Reset Board + Scores</button>
          </div>
          <Scoreboard state={state} setState={setState} />
        </>
      ) : (
        <div style={{ opacity: 0.8, marginTop: 16 }}>
          Tip: Try prompts like "Create a 4th grade family Jeopardy!"
        </div>
      )}

      <Modal open={!!modal} onClose={() => setModal(null)}>
        {modal && (
          <>
            <h3>Question for {`$${modal.clue.value}`}</h3>
            <div className="question">{modal.clue.question}</div>
            {showAnswer && <div className="answer"><strong>Answer:</strong> {modal.clue.answer}</div>}
            <div className="row">
              <button className="secondary" onClick={() => setShowAnswer((v) => !v)}>{showAnswer ? 'Hide Answer' : 'Show Answer'}</button>
              <button className="secondary" onClick={() => setModal(null)}>Close</button>
            </div>
          </>
        )}
      </Modal>

      <div className="footer">
        <span>Local session only — refreshing may clear progress.</span>
        <span>v1.0</span>
      </div>
    </div>
  );
}
