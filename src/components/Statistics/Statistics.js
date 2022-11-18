import React, { useState, useEffect } from "react";
import services from "../../Services/Services";
import { Stack, Grid, Card, CardContent, Button } from "@mui/material";
import "./Statistics.scss";

export default function Statistics() {
  const [statistics, setStatistics] = useState({});
  const [publicGamesStarted, setPublicGamesStarted] = useState([]);
  const [publicGamesFinished, setPublicGamesFinished] = useState([]);
  const [privateGamesStarted, setPrivateGamesStarted] = useState([]);
  const [privateGamesFinished, setPrivateGamesFinished] = useState([]);
  const [playersCountries, setPlayersCountries] = useState(new Map());
  const [currentStatistic, setCurrentStatistic] = useState({
    publicGamesStarted: [],
    publicGamesFinished: [],
    privateGamesStarted: [],
    privateGamesFinished: [],
  });

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    const playersCountries = new Map();
    const statisticsResponse = await services.GetAllStatistics();
    setStatistics(statisticsResponse);
    if (statisticsResponse.length !== undefined) {
      setCurrentStatistic(statisticsResponse[statisticsResponse.length - 1]);
      let publicGamesStarted = [];
      let publicGamesFinished = [];
      let privateGamesStarted = [];
      let privateGamesFinished = [];
      let playersCountries = new Map();
      for (let i = 0; i < statisticsResponse.length; i++) {
        const result = statisticsResponse[i];
        publicGamesStarted = publicGamesStarted.concat(
          result.publicGamesStarted
        );
        publicGamesFinished = publicGamesFinished.concat(
          result.publicGamesFinished
        );
        privateGamesStarted = privateGamesStarted.concat(
          result.privateGamesStarted
        );
        privateGamesFinished = privateGamesFinished.concat(
          result.privateGamesFinished
        );
        const dataCountries = getSumCountries(result.playersCountries);
        playersCountries = new Map(
          [...playersCountries].concat([...getSumCountries(dataCountries)])
        );
        console.log(playersCountries);
      }
      setPublicGamesStarted(publicGamesStarted);
      setPublicGamesFinished(publicGamesFinished);
      setPrivateGamesStarted(privateGamesStarted);
      setPrivateGamesFinished(privateGamesFinished);
      setPlayersCountries(playersCountries);
    }
  };

  return (
    <Stack mt={8} mb={-12.5}>
      <div className="tarjetas">
        <Grid container spacing={4} justifyContent="left">
          <Grid item xs={3} style={{ textAlign: "center" }}>
            <Card style={{ background: "#ffffff9e" }} sx={{ minWidth: 300 }}>
              <CardContent>
                <h1>ESTADISTICAS DEL MES</h1>
                <Stack direction="row" justifyContent="center" mt={4}>
                  <b>Partidas publicas empezadas </b>
                  <Button
                    variant="contained"
                    type="submit"
                    style={{ background: "#053742" }}
                    disableRipple={true}
                  >
                    {publicGamesStarted.length}
                  </Button>
                </Stack>
                <Stack direction="row" justifyContent="center" mt={4}>
                  <b>Partidas publicas finalizadas </b>
                  <Button
                    variant="contained"
                    type="submit"
                    style={{ background: "#053742" }}
                    disableRipple={true}
                  >
                    {publicGamesFinished.length}
                  </Button>
                </Stack>
                <Stack direction="row" justifyContent="center" mt={4}>
                  <b>Partidas privadas empezadas </b>
                  <Button
                    variant="contained"
                    type="submit"
                    style={{ background: "#053742" }}
                    disableRipple={true}
                  >
                    {privateGamesStarted.length}
                  </Button>
                </Stack>
                <Stack direction="row" justifyContent="center" mt={4}>
                  <b>Partidas privadas finalizadas </b>
                  <Button
                    variant="contained"
                    type="submit"
                    style={{ background: "#053742" }}
                    disableRipple={true}
                  >
                    {privateGamesFinished.length}
                  </Button>
                </Stack>
                <Stack justifyContent="center" mt={4}>
                  <b>Origen de conexion de jugadores </b>
                  {playersCountries.forEach(function (value, key) {
                    console.log(key + " = " + value);
                  })}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
      <div>
        <Stack direction="row" mt={-68} justifyContent="center">
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={3} style={{ textAlign: "center" }}>
              <Card style={{ background: "#ffffff9e" }} sx={{ minWidth: 320 }}>
                <CardContent>
                  <h1>ESTADISTICAS DE LA FECHA</h1>
                  <Stack direction="row" justifyContent="center" mt={4}>
                    <b>Partidas publicas empezadas </b>
                    <Button
                      variant="contained"
                      type="submit"
                      style={{ background: "#4A235A" }}
                      disableRipple={true}
                    >
                      {currentStatistic.publicGamesStarted.length}
                    </Button>
                  </Stack>
                  <Stack direction="row" justifyContent="center" mt={4}>
                    <b>Partidas publicas finalizadas </b>
                    <Button
                      variant="contained"
                      type="submit"
                      style={{ background: "#4A235A" }}
                      disableRipple={true}
                    >
                      {currentStatistic.publicGamesFinished.length}
                    </Button>
                  </Stack>
                  <Stack direction="row" justifyContent="center" mt={4}>
                    <b>Partidas privadas empezadas </b>
                    <Button
                      variant="contained"
                      type="submit"
                      style={{ background: "#4A235A" }}
                      disableRipple={true}
                    >
                      {currentStatistic.privateGamesStarted.length}
                    </Button>
                  </Stack>
                  <Stack direction="row" justifyContent="center" mt={4}>
                    <b>Partidas privadas finalizadas </b>
                    <Button
                      variant="contained"
                      type="submit"
                      style={{ background: "#4A235A" }}
                      disableRipple={true}
                    >
                      {currentStatistic.privateGamesFinished.length}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Stack>
      </div>
      <div>
        <Stack direction="row" ml={90} mt={-68}>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={3} style={{ textAlign: "center" }}>
              <Card style={{ background: "#ffffff9e" }} sx={{ minWidth: 320 }}>
                <CardContent>
                  <h1>SELECCIONAR FECHA</h1>
                  <Stack direction="row" justifyContent="center" mt={4}>
                    <b>Partidas publicas empezadas </b>
                    <Button
                      variant="contained"
                      type="submit"
                      style={{ background: "#053742" }}
                      disableRipple={true}
                    >
                      {publicGamesStarted}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Stack>
      </div>
    </Stack>
  );
}

const getSumCountries = (data) => {
  const result = new Map();
  for (const country of data) {
    result[country] = result[country] ? result[country] + 1 : 1;
  }
  return result;
};
