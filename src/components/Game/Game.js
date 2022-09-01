import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import React, { useState, useEffect } from "react";

const URL_GAME = "ws://localhost:8080/ws_game";

export default function Game() {
  const [ws_game, setWs_game] = useState(new WebSocket(URL_GAME));
  const [id, setId] = useState(useParams().gameId);
  const [name, setName] = useState(useParams().nick);

  useEffect(() => {
    ws_game.onopen = () => {
      const addMeMessage = {
        gameId: id,
        gameBoard: "",
        chat: [],
        detail: `ADD ME TO GAME;${name}`,
      };

      ws_game.send(JSON.stringify(addMeMessage));

      ws_game.onmessage = (e) => {
        if (e.data === "WAITING") {
          Swal.fire({
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
        }
        if (e.data === "READY") {
          Swal.fire({
            icon: "warning",
            title: "Comienza el juego",
            heightAuto: false,
            allowOutsideClick: false,
            showCancelButton: false,
            showConfirmButton: false,
            timer: 1000,
            backdrop: `
    rgba(0, 0, 0, 0.8)
    left top
    no-repeat
  `,
          });
        }
      };

      ws_game.onclose = (e) => {};
    };
  }, []);

  console.log(localStorage.getItem("nick"));
  return <p>GAME</p>;
}
