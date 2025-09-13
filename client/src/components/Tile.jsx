import React from 'react';

export default function Tile({ value, used, onClick }) {
  const cls = 'tile' + (used ? ' used' : '');
  return (
    <div className={cls} onClick={() => !used && onClick()}>
      {`$${value}`}
    </div>
  );
}
