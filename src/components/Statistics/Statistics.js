import React, { useState, useEffect } from "react";
import services from "../../Services/Services";
import {
  Stack,
  Grid,
  Card,
  CardContent,
  Button,
  Select,
  MenuItem,
} from "@mui/material";

export default function Statistics() {
  const [publicGamesStarted, setPublicGamesStarted] = useState([]);
  const [publicGamesFinished, setPublicGamesFinished] = useState([]);
  const [privateGamesStarted, setPrivateGamesStarted] = useState([]);
  const [privateGamesFinished, setPrivateGamesFinished] = useState([]);
  const [playersCountries, setPlayersCountries] = useState({});
  const [dates, setDates] = useState([]);
  const [currentPublicGamesStarted, setCurrentPublicGamesStarted] = useState(
    []
  );
  const [currentPublicGamesFinished, setCurrentPublicGamesFinished] = useState(
    []
  );
  const [currentPrivateGamesStarted, setCurrentPrivateGamesStarted] = useState(
    []
  );
  const [currentPrivateGamesFinished, setCurrentPrivateGamesFinished] =
    useState([]);
  const [currentPlayersCountries, setCurrentPlayersCountries] = useState({});
  const [dateSelected, setDateSelected] = useState({});

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    const statisticsResponse = await services.GetAllStatistics();
    if (statisticsResponse.length !== undefined) {
      setCurrentPublicGamesStarted(
        statisticsResponse[statisticsResponse.length - 1].publicGamesStarted
      );
      setCurrentPublicGamesFinished(
        statisticsResponse[statisticsResponse.length - 1].publicGamesFinished
      );
      setCurrentPrivateGamesStarted(
        statisticsResponse[statisticsResponse.length - 1].privateGamesStarted
      );
      setCurrentPrivateGamesFinished(
        statisticsResponse[statisticsResponse.length - 1].privateGamesFinished
      );
      setCurrentPlayersCountries(
        listCountriesToMap(
          statisticsResponse[statisticsResponse.length - 1].playersCountries
        )
      );
      let publicGamesStarted = [];
      let publicGamesFinished = [];
      let privateGamesStarted = [];
      let privateGamesFinished = [];
      let playersCountries = [];
      let dates = [];
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
        playersCountries = playersCountries.concat(result.playersCountries);
        dates.push(result.date);
      }
      setPublicGamesStarted(publicGamesStarted);
      setPublicGamesFinished(publicGamesFinished);
      setPrivateGamesStarted(privateGamesStarted);
      setPrivateGamesFinished(privateGamesFinished);
      setPlayersCountries(listCountriesToMap(playersCountries));
      setDates(dates);
      setDateSelected(dates[0]);
    }
  };

  const handleChangeDate = (event) => {
    const {
      target: { value },
    } = event;
    setDateSelected(value);
  };

  const refreshCurrentDate = async () => {
    const date = splitDate(dateSelected);
    const response = await services.GetStatisticsOfDate(
      date[2],
      date[1],
      date[0]
    );
    setCurrentPublicGamesStarted(response.publicGamesStarted);
    setCurrentPublicGamesFinished(response.publicGamesFinished);
    setCurrentPrivateGamesStarted(response.privateGamesStarted);
    setCurrentPrivateGamesFinished(response.privateGamesFinished);
    setCurrentPlayersCountries(listCountriesToMap(response.playersCountries));
  };

  return (
    <Grid container spacing={55}>
      <Grid container item xs={2} ml={9} mt={4} style={{ textAlign: "center" }}>
        <Card style={{ background: "#ffffff9e" }} sx={{ minWidth: 320 }}>
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
              {Object.keys(playersCountries).map((key, index) => {
                return (
                  <div key={index}>
                    <p>
                      <b>{key}:</b> {playersCountries[key]}
                    </p>
                  </div>
                );
              })}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <Grid container item xs={2} mt={4} style={{ textAlign: "center" }}>
        <Card style={{ background: "#ffffff9e" }} sx={{ minWidth: 320 }}>
          <CardContent>
            <h1>ESTADISTICAS DE LA FECHA</h1>
            <Stack direction="row" justifyContent="center" mt={4}>
              <b>Partidas publicas empezadas </b>
              <Button
                variant="contained"
                type="submit"
                style={{ background: "#0C3F03" }}
                disableRipple={true}
              >
                {currentPublicGamesStarted.length}
              </Button>
            </Stack>
            <Stack direction="row" justifyContent="center" mt={4}>
              <b>Partidas publicas finalizadas </b>
              <Button
                variant="contained"
                type="submit"
                style={{ background: "#0C3F03" }}
                disableRipple={true}
              >
                {currentPublicGamesFinished.length}
              </Button>
            </Stack>
            <Stack direction="row" justifyContent="center" mt={4}>
              <b>Partidas privadas empezadas </b>
              <Button
                variant="contained"
                type="submit"
                style={{ background: "#0C3F03" }}
                disableRipple={true}
              >
                {currentPrivateGamesStarted.length}
              </Button>
            </Stack>
            <Stack direction="row" justifyContent="center" mt={4}>
              <b>Partidas privadas finalizadas </b>
              <Button
                variant="contained"
                type="submit"
                style={{ background: "#0C3F03" }}
                disableRipple={true}
              >
                {currentPrivateGamesFinished.length}
              </Button>
            </Stack>
            <Stack justifyContent="center" mt={4}>
              <b>Origen de conexion de jugadores </b>
              {Object.keys(currentPlayersCountries).map((key, index) => {
                return (
                  <div key={index}>
                    <p>
                      <b>{key}:</b> {currentPlayersCountries[key]}
                    </p>
                  </div>
                );
              })}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <Grid container item xs={2} mt={4} style={{ textAlign: "center" }}>
        <Card
          style={{ background: "#ffffff9e" }}
          sx={{ minWidth: 320, maxHeight: 275 }}
        >
          <CardContent>
            <h1>SELECCIONAR FECHA</h1>
            <Stack direction="row" justifyContent="center" mt={2}>
              <Select value={dateSelected} onChange={handleChangeDate}>
                {dates.map((d) => (
                  <MenuItem value={d}>{dateToArgFormat(d)}</MenuItem>
                ))}
              </Select>
            </Stack>
            <Stack direction="row" justifyContent="center" mt={2}>
              <Button
                variant="contained"
                style={{ background: "#39A2DB" }}
                onClick={() => refreshCurrentDate()}
              >
                Actualizar
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

const listCountriesToMap = (data) => {
  let result = {};
  for (const country of data) {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i] === country) {
        sum += 1;
      }
    }
    result[country] = sum;
  }
  return result;
};

const splitDate = (date) => {
  return date.split("-");
};

const dateToArgFormat = (date) => {
  const split = date.split("-");
  return `${split[2]}-${split[1]}-${split[0]}`;
};
