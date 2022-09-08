import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import React, { useState, useEffect } from "react";
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

const URL_GAME = "ws://localhost:8080/ws_game";

export default function Game() {
  // eslint-disable-next-line no-unused-vars
  const [ws_game, setWs_game] = useState(new WebSocket(URL_GAME));
  // eslint-disable-next-line no-unused-vars
  const [id, setId] = useState(useParams().gameId);
  // eslint-disable-next-line no-unused-vars
  const [name, setName] = useState(useParams().nick);
  // eslint-disable-next-line no-unused-vars
  const [board, setBoard] = useState({});
  const [chat, setChat] = useState([]);
  const [players, setPlayers] = useState({});

  useEffect(() => {
    ws_game.onopen = () => {
      ws_game.send(CreateMessageGame(id, name, `ADD ME TO GAME`));

      ws_game.onmessage = (e) => {
        HandleMessageGame(JSON.parse(e.data));
      };

      ws_game.onclose = (e) => {
        SwalDisconnect();
      };
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const HandleMessageGame = (message) => {
    if (message.detail === "WAITING") {
      SwalWaiting();
    } else if (message.detail === "READY") {
      SwalStart();
      setPlayers({
        player1Name: message.data[0],
        player1Id: message.data[1],
        player2Name: message.data[2],
        player2Id: message.data[3],
      });
    } else if (message.detail === "DISCONNECT") {
      SwalDisconnectOpponent();
    } else if (message.detail === "CHAT") {
      setChat([...chat, message.data]);
    }
  };

  return (
    <main className="game">
      <h1>4 EN RAYA</h1>
      <ConnectFourGame />
    </main>
  );
}

const CreateMessageGame = (gameId, data, detail) => {
  return JSON.stringify({
    gameId: gameId,
    data: data,
    detail: detail,
  });
};

const SwalWaiting = () => {
  return Swal.fire({
    title: "Conectando...",
    heightAuto: false,
    allowOutsideClick: false,
    showCancelButton: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
    backdrop: `
    rgba(0, 0, 0, 0.8)
    left top
    no-repeat
  `,
  });
};

const SwalStart = () => {
  return Swal.fire({
    icon: "warning",
    title: "Comienza el juego",
    heightAuto: false,
    allowOutsideClick: false,
    showCancelButton: false,
    showConfirmButton: false,
    timer: 3000,
    backdrop: `
    rgba(0, 0, 0, 0.8)
    left top
    no-repeat
  `,
  });
};

const SwalDisconnect = () => {
  return Swal.fire({
    icon: "error",
    title: "Se ha perdido la conexion",
    heightAuto: false,
    allowOutsideClick: false,
    showCancelButton: false,
    showConfirmButton: false,
    timer: 5000,
    backdrop: `
    rgba(0, 0, 0, 0.8)
    left top
    no-repeat
  `,
  }).then((result) => {
    if (result.dismiss === Swal.DismissReason.timer) {
      window.location = window.location.origin;
    }
  });
};

const SwalDisconnectOpponent = () => {
  return Swal.fire({
    icon: "error",
    title: "Tu oponente se ha desconectado",
    heightAuto: false,
    allowOutsideClick: false,
    showCancelButton: false,
    showConfirmButton: false,
    timer: 5000,
    backdrop: `
    rgba(0, 0, 0, 0.8)
    left top
    no-repeat
  `,
  }).then((result) => {
    if (result.dismiss === Swal.DismissReason.timer) {
      window.location = window.location.origin;
    }
  });
};
