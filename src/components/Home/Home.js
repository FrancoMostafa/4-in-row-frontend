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
  return Swal.fire({
    title: "Buscando oponente...",
    showCancelButton: true,
    showConfirmButton: false,
    allowOutsideClick: false,
    cancelButtonText: "Cancelar",
    cancelButtonColor: "red",
    didOpen: () => {
      Swal.showLoading();
    },
  });
}

function FindPrivateMatch() {
  return Swal.fire({
    title: "Ingrese codigo de partida",
    input: "text",
    showCancelButton: true,
    confirmButtonText: "Ingresar",
    cancelButtonText: "Salir",
  }).then((result) => {
    if (result.value !== undefined && result.value !== "") {
      Swal.fire({
        title: "Exito!",
        text: "El codigo es " + result.value,
        icon: "success",
        confirmButtonText: "Cerrar",
      });
    } else {
      Swal.fire({
        title: "Error!",
        text: "El codigo es incorrecto",
        icon: "error",
        confirmButtonText: "Cerrar",
      });
    }
  });
}
