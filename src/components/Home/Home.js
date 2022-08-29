import {
  Button,
  Stack,
  Grid,
  Card,
  CardContent,
  TextField,
} from "@mui/material";
import Swal from "sweetalert2";
import "./Home.scss";
import React, { useState } from "react";

const URL_PUBLIC = "ws://localhost:8080/ws_search_public";
const URL_PRIVATE = "ws://localhost:8080/ws_search_private";

export default function Home() {
  const [nick, setNick] = useState("");

  const handleChangeNick = (e) => {
    setNick(e.target.value);
  };

  return (
    <Stack direction="column" ml={2} mt={12} justifyContent="center">
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={4} style={{ textAlign: "center" }}>
          <Card style={{ background: "#ffffff9e" }} sx={{ minWidth: 300 }}>
            <CardContent>
              <h1>4 EN RAYA</h1>

              <Stack direction="row" justifyContent="center" mt={8}>
                <TextField
                  style={{ background: "white" }}
                  label="Nick"
                  onChange={handleChangeNick}
                  value={nick}
                />
              </Stack>

              <Stack direction="row" justifyContent="center" mt={4}>
                <Button
                  variant="contained"
                  type="submit"
                  style={{ background: "#053742" }}
                  onClick={() => PreFunctionCall(nick, FindPublicMatch)}
                >
                  Partida Pública
                </Button>
              </Stack>
              <Stack direction="row" justifyContent="center" mt={4}>
                <Button
                  variant="contained"
                  type="submit"
                  style={{ background: "#053742" }}
                  onClick={() => PreFunctionCall(nick, CreatePrivateMatch)}
                >
                  Crear Partida Privada
                </Button>
              </Stack>
              <Stack direction="row" justifyContent="center" mb={8} mt={4}>
                <Button
                  variant="contained"
                  type="submit"
                  style={{ background: "#053742" }}
                  onClick={() => PreFunctionCall(nick, FindPrivateMatch)}
                >
                  Buscar Partida Privada
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}

function PreFunctionCall(nickSelected, functionCall) {
  if (nickSelected.length >= 3 && nickSelected.length <= 15) {
    functionCall();
  } else {
    Swal.fire({
      title: `Por favor, ingrese un nick de 3 a 15 caracteres`,
      heightAuto: false,
      allowOutsideClick: false,
      showCancelButton: false,
      showConfirmButton: true,
      icon: "error",
      confirmButtonText: "OK",
      cancelButtonColor: "green",
      backdrop: `
          rgba(0, 0, 0, 0.8)
          left top
          no-repeat
        `,
    });
  }
}

function FindPublicMatch() {
  const ws_search = new WebSocket(URL_PUBLIC);

  ws_search.onopen = () => {
    ws_search.send("NEW PLAYER IN SEARCH");

    ws_search.onmessage = (e) => {
      window.location = `/game/${e.data}`;
    };

    ws_search.onclose = (e) => {};
  };

  return Swal.fire({
    title: "Buscando oponente...",
    heightAuto: false,
    allowOutsideClick: false,
    cancelButtonText: "Cancelar",
    cancelButtonColor: "red",
    showCancelButton: true,
    showConfirmButton: false,
    backdrop: `
    rgba(0, 0, 0, 0.8)
    left top
    no-repeat
  `,
  }).then((result) => {
    if (!result.isConfirmed) {
      ws_search.close();
    }
  });
}

function CreatePrivateMatch() {
  const numberMatch = Math.floor(Math.random() * (99999 - 10000 + 1) + 10000);

  const ws_search = new WebSocket(URL_PRIVATE);

  ws_search.onopen = () => {
    ws_search.send(`${numberMatch};CREATE`);

    ws_search.onmessage = (e) => {
      window.location = `/game/${e.data}`;
    };

    ws_search.onclose = (e) => {};
  };

  return Swal.fire({
    title: `Su codigo de partida es ${numberMatch} esperando oponente...`,
    heightAuto: false,
    allowOutsideClick: false,
    showCancelButton: true,
    showConfirmButton: false,
    cancelButtonText: "Cancelar",
    cancelButtonColor: "red",
    backdrop: `
    rgba(0, 0, 0, 0.8)
    left top
    no-repeat
  `,
  }).then((result) => {
    if (!result.isConfirmed) {
      ws_search.close();
    }
  });
}

function FindPrivateMatch() {
  const ws_search = new WebSocket(URL_PRIVATE);

  ws_search.onopen = () => {
    ws_search.onmessage = (e) => {
      const message = e.data;
      if (message === "THE GAME WAS NOT FOUND") {
        Swal.fire({
          title: `No se encontro una partida con este codigo`,
          heightAuto: false,
          allowOutsideClick: false,
          showCancelButton: false,
          showConfirmButton: true,
          icon: "error",
          confirmButtonText: "OK",
          cancelButtonColor: "green",
          backdrop: `
          rgba(0, 0, 0, 0.8)
          left top
          no-repeat
        `,
        }).then((result) => {
          if (result.isConfirmed) {
            ws_search.close();
          }
        });
      } else {
        window.location = `/game/${message}`;
      }
    };

    ws_search.onclose = (e) => {};
  };

  return Swal.fire({
    title: "Ingrese codigo de partida",
    heightAuto: false,
    allowOutsideClick: false,
    input: "text",
    showCancelButton: true,
    showCloseButton: true,
    confirmButtonText: "Aceptar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "green",
    cancelButtonColor: "red",
    backdrop: `
    rgba(0, 0, 0, 0.8)
    left top
    no-repeat
  `,
  }).then((result) => {
    if (!result.isConfirmed) {
      ws_search.close();
    } else {
      if (verifyInputCode(result.value)) {
        ws_search.send(`${result.value};FIND`);
      } else {
        Swal.fire({
          title: `Codigo Invalido`,
          heightAuto: false,
          allowOutsideClick: false,
          showCancelButton: false,
          showConfirmButton: true,
          icon: "error",
          confirmButtonText: "OK",
          cancelButtonColor: "green",
          backdrop: `
          rgba(0, 0, 0, 0.8)
          left top
          no-repeat
        `,
        }).then((result) => {
          if (result.isConfirmed) {
            ws_search.close();
          }
        });
      }
    }
  });
}

function verifyInputCode(code) {
  return code.length === 5 && Object.assign([], code).every(isNumber);
}

function isNumber(value) {
  const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  return numbers.includes(value);
}
