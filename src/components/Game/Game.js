import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import React, { useState, useEffect } from "react";
import "./Game.scss";
import {
  Stack,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
} from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

const URL_GAME = "ws://localhost:8080/ws_game";

let initial = {};
for (var c = 0; c < 7; c++) {
  initial[c] = [null, null, null, null, null, null];
}

const playerId = (Math.random() + 1).toString(36).substring(7);
let rematchConfirm = false;

export default function Game() {
  // eslint-disable-next-line no-unused-vars
  const [ws_game, setWs_game] = useState(new WebSocket(URL_GAME));
  // eslint-disable-next-line no-unused-vars
  const [name, setName] = useState(useParams().nick);
  // eslint-disable-next-line no-unused-vars
  const [gameId, setGameId] = useState(useParams().gameId);
  const [board, setBoard] = useState(initial);
  const [chat, setChat] = useState([]);
  const [chatMessage, setChatMessage] = useState("");
  const [turn, setTurn] = useState(null);
  const [players, setPlayers] = useState({});
  const [playerNumber, setPlayerNumber] = useState(null);

  useEffect(() => {
    ws_game.onopen = () => {
      ws_game.send(
        CreateMessageGame(gameId, `${name};${playerId}`, `ADD ME TO GAME`)
      );

      ws_game.onmessage = (e) => {
        HandleMessageGame(JSON.parse(e.data));
      };

      ws_game.onclose = (e) => {
        SwalDisconnect();
      };
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ws_game.onmessage, ws_game.onopen, ws_game.onclose]);

  const HandleMessageGame = (message) => {
    if (message.detail === "WAITING") {
      SwalWaiting();
    } else if (message.detail === "READY") {
      const player1Name = message.data[0].split(";")[0];
      const player1Id = message.data[0].split(";")[1];
      const player2Name = message.data[1].split(";")[0];
      const player2Id = message.data[1].split(";")[1];
      const initialTurn = message.data[2];

      setPlayers({
        player1Name: player1Name,
        player1Id: player1Id,
        player1Wins: 0,
        player2Name: player2Name,
        player2Id: player2Id,
        player2Wins: 0,
      });

      if (playerId === player1Id) {
        setPlayerNumber(1);
        setName(player1Name);
      } else if (playerId === player2Id) {
        setPlayerNumber(2);
        setName(player2Name);
      }

      initTurn(initialTurn);

      SwalStart();
    } else if (message.detail === "DISCONNECT") {
      SwalDisconnectOpponent();
    } else if (message.detail === "CHAT") {
      const user = message.data.user;
      const text = message.data.text;
      setChat((chat) => [...chat, { user: user, text: text }]);
    } else if (message.detail === "MOVE") {
      const pieceData = message.data[0];
      const playerNumberData = message.data[1];
      const turnData = message.data[2];
      let playersData = message.data[3];
      addPiece(pieceData, playerNumberData);
      const roundResult = roundOver();
      const roundResultEvaluate = roundResult[0];
      const roundResultColorWin = roundResult[1];
      const roundResultWinRow = roundResult[2];
      if (roundResultEvaluate) {
        if (roundResultColorWin !== "DRAW") {
          playersData = addWinToPlayer(roundResultColorWin, playersData);
          SwalRoundWinner(roundResultColorWin, playersData, SwalRematch);
          PrintWinRow(roundResultWinRow);
          //resetBoard();
        } else {
          SwalDraw();
          //resetBoard();
        }
      }
      changeTurn(turnData);
    } else {
      // REMATCH
      const rematchAcceptedIncomingValue = message.data;
      if (!rematchAcceptedIncomingValue) {
        // REMATCH NOT ACCEPTED
        window.location = window.location.origin;
      } else if (rematchConfirm) {
        // REMATCH START
        setPlayers({
          player1Name: players.player1Name,
          player1Id: players.player1Id,
          player1Wins: 0,
          player2Name: players.player2Name,
          player2Id: players.player2Id,
          player2Wins: 0,
        });
        resetBoard();
        SwalStart();
        rematchConfirm = false;
      } else {
        // REMATCH CONFIRM
        rematchConfirm = true;
      }
    }
  };

  const changeTurn = (t) => {
    if (t === 1) {
      setTurn(2);
    } else {
      setTurn(1);
    }
  };

  const initTurn = (initial) => {
    setTurn(initial);
  };

  const sendMessageChat = () => {
    ws_game.send(
      CreateMessageGame(gameId, { user: name, text: `${chatMessage}` }, "CHAT")
    );
    setChatMessage("");
  };

  const handleChangeChatMessage = (e) => {
    setChatMessage(e.target.value);
  };

  const handleKeypress = (e) => {
    if (e.key === "Enter") {
      sendMessageChat();
    }
  };

  const Chat = () => {
    return (
      <Stack direction="row" justifyContent="left" ml={156}>
        <Grid
          style={{ textAlign: "left" }}
          sx={{
            width: "100%",
            maxWidth: 275,
            bgcolor: "background.paper",
            position: "relative",
            overflow: "auto",
            maxHeight: 300,
            "& ul": { padding: 0 },
          }}
        >
          <div className="chat">
            <Card style={{ background: "white" }} sx={8} md={4}>
              <CardContent>
                {chat.map((message) => (
                  <Stack direction="row" justifyContent="left" mt={0.5}>
                    <b>{message.user}</b>: {message.text}
                  </Stack>
                ))}
                <Stack direction="row" justifyContent="left" mt={2}>
                  <TextField
                    style={{ background: "white" }}
                    label="Mensaje"
                    onChange={handleChangeChatMessage}
                    onKeyPress={handleKeypress}
                    value={chatMessage}
                  />
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="center"
                  mt={1}
                  mb={0.01}
                  onClick={() => sendMessageChat()}
                >
                  <Button variant="contained" size="small">
                    enviar
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </div>
        </Grid>
      </Stack>
    );
  };

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

  const roundOver = () => {
    const isYellow = (piece) => {
      return piece !== null && piece.props.className === "amarillo";
    };
    const isRed = (piece) => {
      return piece !== null && piece.props.className === "rojo";
    };
    // game over vertical:
    for (let c = 0; c <= 6; c++) {
      for (let r = 0; r <= 2; r++) {
        if (
          isRed(board[c][r]) &&
          isRed(board[c][r + 1]) &&
          isRed(board[c][r + 2]) &&
          isRed(board[c][r + 3])
        ) {
          return [
            true,
            "rojo",
            [
              [c, r],
              [c, r + 1],
              [c, r + 2],
              [c, r + 3],
            ],
          ];
        }
        if (
          isYellow(board[c][r]) &&
          isYellow(board[c][r + 1]) &&
          isYellow(board[c][r + 2]) &&
          isYellow(board[c][r + 3])
        ) {
          return [
            true,
            "amarillo",
            [
              [c, r],
              [c, r + 1],
              [c, r + 2],
              [c, r + 3],
            ],
          ];
        }
      }
    }

    // game over horizontal:
    for (let c = 0; c <= 3; c++) {
      for (let r = 0; r <= 5; r++) {
        if (
          isRed(board[c][r]) &&
          isRed(board[c + 1][r]) &&
          isRed(board[c + 2][r]) &&
          isRed(board[c + 3][r])
        ) {
          return [
            true,
            "rojo",
            [
              [c, r],
              [c + 1, r],
              [c + 2, r],
              [c + 3, r],
            ],
          ];
        }
        if (
          isYellow(board[c][r]) &&
          isYellow(board[c + 1][r]) &&
          isYellow(board[c + 2][r]) &&
          isYellow(board[c + 3][r])
        ) {
          return [
            true,
            "amarillo",
            [
              [c, r],
              [c + 1, r],
              [c + 2, r],
              [c + 3, r],
            ],
          ];
        }
      }
    }

    // game over diagonal:
    for (let c = 0; c <= 6; c++) {
      for (let r = 0; r <= 5; r++) {
        if (c >= 3 && r >= 3) {
          if (
            isRed(board[c][r]) &&
            isRed(board[c - 1][r - 1]) &&
            isRed(board[c - 2][r - 2]) &&
            isRed(board[c - 3][r - 3])
          ) {
            return [
              true,
              "rojo",
              [
                [c, r],
                [c - 1, r - 1],
                [c - 2, r - 2],
                [c - 3, r - 3],
              ],
            ];
          }
          if (
            isYellow(board[c][r]) &&
            isYellow(board[c - 1][r - 1]) &&
            isYellow(board[c - 2][r - 2]) &&
            isYellow(board[c - 3][r - 3])
          ) {
            return [
              true,
              "amarillo",
              [
                [c, r],
                [c - 1, r - 1],
                [c - 2, r - 2],
                [c - 3, r - 3],
              ],
            ];
          }
        }

        if (c >= 3 && r <= 3) {
          if (
            isRed(board[c][r]) &&
            isRed(board[c - 1][r + 1]) &&
            isRed(board[c - 2][r + 2]) &&
            isRed(board[c - 3][r + 3])
          ) {
            return [
              true,
              "rojo",
              [
                [c, r],
                [c - 1, r + 1],
                [c - 2, r + 2],
                [c - 3, r + 3],
              ],
            ];
          }
          if (
            isYellow(board[c][r]) &&
            isYellow(board[c - 1][r + 1]) &&
            isYellow(board[c - 2][r + 2]) &&
            isYellow(board[c - 3][r + 3])
          ) {
            return [
              true,
              "amarillo",
              [
                [c, r],
                [c - 1, r + 1],
                [c - 2, r + 2],
                [c - 3, r + 3],
              ],
            ];
          }
        }

        if (c <= 3 && r <= 3) {
          if (
            isRed(board[c][r]) &&
            isRed(board[c + 1][r + 1]) &&
            isRed(board[c + 2][r + 2]) &&
            isRed(board[c + 3][r + 3])
          ) {
            return [
              true,
              "rojo",
              [
                [c, r],
                [c + 1, r + 1],
                [c + 2, r + 2],
                [c + 3, r + 3],
              ],
            ];
          }
          if (
            isYellow(board[c][r]) &&
            isYellow(board[c + 1][r + 1]) &&
            isYellow(board[c + 2][r + 2]) &&
            isYellow(board[c + 3][r + 3])
          ) {
            return [
              true,
              "amarillo",
              [
                [c, r],
                [c + 1, r + 1],
                [c + 2, r + 2],
                [c + 3, r + 3],
              ],
            ];
          }
        }

        if (c <= 3 && r >= 3) {
          if (
            isRed(board[c][r]) &&
            isRed(board[c + 1][r - 1]) &&
            isRed(board[c + 2][r - 2]) &&
            isRed(board[c + 3][r - 3])
          ) {
            return [
              true,
              "rojo",
              [
                [c, r],
                [c + 1, r - 1],
                [c + 2, r - 2],
                [c + 3, r - 3],
              ],
            ];
          }
          if (
            isYellow(board[c][r]) &&
            isYellow(board[c + 1][r - 1]) &&
            isYellow(board[c + 2][r - 2]) &&
            isYellow(board[c + 3][r - 3])
          ) {
            return [
              true,
              "amarillo",
              [
                [c, r],
                [c + 1, r - 1],
                [c + 2, r - 2],
                [c + 3, r - 3],
              ],
            ];
          }
        }
      }

      // game over draw
      let count = 0;
      for (let c = 0; c <= 6; c++) {
        for (let r = 0; r <= 5; r++) {
          if (isRed(board[c][r]) || isYellow(board[c][r])) {
            count += 1;
          } else {
            break;
          }
        }
      }
      if (count === 42) {
        return [true, "DRAW", null];
      }
    }

    return [false, null, null];
  };

  const sendMove = (columnIdx, pNro, t, p) => {
    if (pNro === t) {
      changeTurn(t);
      ws_game.send(CreateMessageGame(gameId, [columnIdx, pNro, t, p], "MOVE"));
    }
  };

  const addPiece = (columnIdx, pNro) => {
    const column = board[columnIdx];
    const piecePos = column.indexOf(null);
    let piece;
    const red_piece = <div className="rojo"></div>;
    const yellow_piece = <div className="amarillo"></div>;

    if (pNro === 1) {
      piece = red_piece;
    } else if (pNro === 2) {
      piece = yellow_piece;
    }
    column[piecePos] = piece;
    setBoard({
      ...board,
      [columnIdx]: column,
    });
  };

  const resetBoard = () => {
    for (let c = 0; c <= 6; c++) {
      for (let r = 0; r <= 5; r++) {
        const column = board[c];
        column[r] = null;
        setBoard({ ...board, [r]: column });
      }
    }
  };

  const addWinToPlayer = (winnerColor, p) => {
    let newPlayersData = {};
    if (winnerColor === "rojo") {
      newPlayersData = {
        player1Name: p.player1Name,
        player1Id: p.player1Id,
        player1Wins: p.player1Wins + 1,
        player2Name: p.player2Name,
        player2Id: p.player2Id,
        player2Wins: p.player2Wins,
      };
    } else {
      newPlayersData = {
        player1Name: p.player1Name,
        player1Id: p.player1Id,
        player1Wins: p.player1Wins,
        player2Name: p.player2Name,
        player2Id: p.player2Id,
        player2Wins: p.player2Wins + 1,
      };
    }
    setPlayers(newPlayersData);
    return newPlayersData;
  };

  const PrintWinRow = (winRow) => {
    const piece = <div className="negro"></div>;
    for (let i = 0; i < winRow.length; i++) {
      console.log(winRow[i]);
      const column = board[winRow[i][0]];
      column[winRow[i][1]] = piece;
      setBoard({ ...board, [winRow[i][0]]: column });
    }
  };

  const SwalRematch = () => {
    return Swal.fire({
      title: `Revancha?`,
      heightAuto: false,
      allowOutsideClick: false,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Si",
      cancelButtonText: "No",
      confirmButtonColor: "green",
      cancelButtonColor: "red",
      backdrop: `
    rgba(0, 0, 0, 0.8)
    left top
    no-repeat
  `,
    }).then((result) => {
      ws_game.send(CreateMessageGame(gameId, result.isConfirmed, "REMATCH"));
      if (result.isConfirmed) {
        SwalRematchWaiting();
      }
    });
  };

  const ConnectFourGame = () => {
    return (
      <div className="board">
        {Object.entries(board).map(([k, col], x) => {
          return (
            <GameColumn
              col={col}
              idx={x}
              onClick={() => sendMove(x, playerNumber, turn, players)}
            />
          );
        })}
      </div>
    );
  };

  return (
    <main className="game">
      <Paper>
        <h1>4 EN LÍNEA</h1>
      </Paper>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          "& > :not(style)": {
            m: 0.4,
            width: 310,
            height: 310,
          },
        }}
      >
        <div>
          <Paper>
            <h3>
              <div className="rojoJugador"></div>
              {players.player1Name}
            </h3>
          </Paper>
          <Paper>
            <h3>
              <div className="amarilloJugador"></div>
              {players.player2Name}
            </h3>
          </Paper>
        </div>
        <Paper>{ConnectFourGame()}</Paper>
      </Box>
      {Chat()}
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
    timer: 5000,
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

const SwalRoundWinner = (winnerColor, pData, swalRematch) => {
  let winnerRoundName;
  if (winnerColor === "rojo") {
    winnerRoundName = pData.player1Name;
  } else {
    winnerRoundName = pData.player2Name;
  }
  return Swal.fire({
    title: `${winnerRoundName} gana la ronda!`,
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
      if (pData.player1Wins === 3 || pData.player2Wins === 3) {
        SwalPlayerWinner(winnerRoundName, swalRematch);
      }
    }
  });
};

const SwalPlayerWinner = (pName, swalRematch) => {
  return Swal.fire({
    title: `${pName} gana la partida!`,
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
      swalRematch();
    }
  });
};

const SwalDraw = () => {
  return Swal.fire({
    title: `Empate!`,
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
  });
};

const SwalRematchWaiting = () => {
  return Swal.fire({
    title: `Esperando confirmacion de oponente...`,
    heightAuto: false,
    allowOutsideClick: false,
    showCancelButton: false,
    showConfirmButton: false,
    backdrop: `
    rgba(0, 0, 0, 0.8)
    left top
    no-repeat
  `,
  });
};
