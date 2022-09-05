import { useState } from "react";
import "./Game.scss";

const GameColumn = ({ col, idx, onClick }) => {
  return (
    <div className="column" key={`col-${idx}`} onClick={onClick}>
      {col.map((cell, x) => {
        return (
          <span className="cell" key={`cell-${idx}-${x}`}>
            {cell}
          </span>
        );
      })}
    </div>
  );
};

const Red_piece = () => {
  return <div className="rojo"></div>;
};

const Yellow_piece = () => {
  return <div className="amarillo"></div>;
};

const ConnectFourGame = () => {
  let initial = {};
  for (var c = 0; c < 7; c++) {
    initial[c] = [null, null, null, null, null, null];
  }
  const [gameState, setGameState] = useState(initial);
  const [currentPlayer, setCurrentPlayer] = useState(Yellow_piece);

  const gameOver = () => {
    // game over vertical:
    for (let c = 0; c < 7; c++) {
      for (let r = 0; r < 6 - 3; r++) {
        if (
          gameState[c][r] !== null &&
          gameState[c][r] === gameState[c][r + 1] &&
          gameState[c][r + 1] === gameState[c][r + 2] &&
          gameState[c][r + 2] === gameState[c][r + 3]
        ) {
          return true;
        }
      }
    }

    // game over horizontal:
    for (let c = 0; c < 7 - 3; c++) {
      for (let r = 0; r < 6; r++) {
        if (
          gameState[c][r] !== null &&
          gameState[c][r] === gameState[c][r + 1] &&
          gameState[c + 1][r] === gameState[c + 2][r] &&
          gameState[c + 2][r] === gameState[c + 3][r]
        ) {
          return true;
        }
      }
    }
  };

  const addPiece = (columnIdx) => {
    console.log(columnIdx);
    const column = gameState[columnIdx];
    const piecePos = column.indexOf(null);
    column[piecePos] = currentPlayer;
    setGameState({
      ...gameState,
      [columnIdx]: column,
    });

    if (gameOver()) {
      alert("GAME OVER");
    }
    setCurrentPlayer(currentPlayer === Red_piece ? Yellow_piece : Red_piece);
  };

  return (
    <div className="board">
      {Object.entries(gameState).map(([k, col], x) => {
        return <GameColumn col={col} idx={x} onClick={() => addPiece(x)} />;
      })}
    </div>
  );
};

export default function Game() {
  return (
    <main className="game">
      <h1>4 EN RAYA</h1>
      <ConnectFourGame />
    </main>
  );
}
