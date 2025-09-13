import React from 'react';
import Tile from './Tile.jsx';

export default function Board({ board, usedSet, onTileClick }) {
  if (!board || !board.categories || board.categories.length !== 5) return null;
  // Render header row (categories) + 5 rows of tiles
  return (
    <div className="board" role="grid" aria-label="Jeopardy board">
      {board.categories.map((cat, i) => (
        <div key={`cat-${i}`} className="category">{cat.title}</div>
      ))}
      {[0,1,2,3,4].map((row) => (
        board.categories.map((cat, col) => {
          const clue = cat.clues[row];
          const key = `${col}-${row}`;
          const used = usedSet.has(key);
          return (
            <Tile
              key={`tile-${key}`}
              value={clue.value}
              used={used}
              onClick={() => onTileClick(col, row, clue)}
            />
          );
        })
      ))}
    </div>
  );
}

