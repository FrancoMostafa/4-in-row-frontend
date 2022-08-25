import React from "react";
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

const URL_PUBLIC = "ws://localhost:8080/ws_search_public";
const URL_PRIVATE = "ws://localhost:8080/ws_search_private";

export default function Home() {
  return (
    <Stack direction="column" ml={2} mt={12} justifyContent="center">
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={4} style={{ textAlign: "center" }}>
          <Card style={{ background: "#ffffff9e" }} sx={{ minWidth: 300 }}>
            <CardContent>
              <h1>4 EN RAYA</h1>

              <Stack direction="row" justifyContent="center" mt={8}>
                <TextField style={{ background: "white" }} label="Nick" />
              </Stack>

              <Stack direction="row" justifyContent="center" mt={4}>
                <Button
                  variant="contained"
                  type="submit"
                  style={{ background: "#053742" }}
                  onClick={() => FindPublicMatch()}
                >
                  Partida Pública
                </Button>
              </Stack>
              <Stack direction="row" justifyContent="center" mt={4}>
                <Button
                  variant="contained"
                  type="submit"
                  style={{ background: "#053742" }}
                  onClick={() => CreatePrivateMatch()}
                >
                  Crear Partida Privada
                </Button>
              </Stack>
              <Stack direction="row" justifyContent="center" mb={8} mt={4}>
                <Button
                  variant="contained"
                  type="submit"
                  style={{ background: "#053742" }}
                  onClick={() => FindPrivateMatch()}
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
    ws_search.send(`${numberMatch}`);

    ws_search.onmessage = (e) => {
      window.location = `/game/${e.data}`;
    };

    ws_search.onclose = (e) => {};
  };

  return Swal.fire({
    title: `Su codigo de partida es ${numberMatch} esperando oponente...`,
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
      window.location = `/game/${e.data}`;
    };

    ws_search.onclose = (e) => {};
  };

  return Swal.fire({
    title: "Ingrese codigo de partida",
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
    if (result.value !== undefined && result.value !== "") {
      console.log(result.value);
    }
  });
}
