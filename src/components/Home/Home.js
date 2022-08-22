import React from "react";
import {
  Button,
  Stack,
  Grid,
  Card,
  CardContent,
  TextField
} from "@mui/material";
import Swal from 'sweetalert2';
import "./Home.scss";

function alert() {
  const { value: partida } = Swal.fire({
    title: 'Ingrese el código de la partida',
    input: 'text',
    showCancelButton: true,
    inputValidator: (value) => {
      if (!value) {
        return 'Por favor ingrese el código!'
        }
      }
    })

    if (partida) {
      Swal.fire(`Tu codigo es ${partida}`)
    }
  }  

export default function Home() {
  return (
    <Stack direction="column" ml={2} mt={12} justifyContent="center">
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={4} style={{ textAlign: "center" }}>
          <Card style={{ background: "#ffffff9e"}} sx={{ minWidth: 300 }}>
            <CardContent>
              <h1>4 EN RAYA</h1>
              
                <Stack direction="row" justifyContent="center" mt={8}>
                  <TextField
                    style={{ background: "white" }}
                   
                    label="Nick"
                  />
                </Stack>
               
                <Stack direction="row" justifyContent="center" mt={4}>
                  <Button
                    variant="contained"
                    type="submit"
                    style={{ background: "#053742" }}
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
};

