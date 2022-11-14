import React, { useState, useEffect } from "react";
import services from "../../Services/Services";
import { Stack, Grid, Card, CardContent, Button } from "@mui/material";

export default function Statistics() {
  const [statistics, setStatistics] = useState({});
  const [publicGamesStarted, setPublicGamesStarted] = useState(0);
  const [publicGamesFinished, setPublicGamesFinished] = useState(0);
  const [privateGamesStarted, setPrivateGamesStarted] = useState(0);
  const [privateGamesFinished, setPrivateGamesFinished] = useState(0);
  const [countriesPlayers, setCountriesPlayers] = useState({});
  const [currentStatistic, setCurrentStatistic] = useState({});

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    const statisticsResponse = await services.GetAllStatistics();
    setStatistics(statisticsResponse);
    if (statisticsResponse.length !== undefined) {
      setCurrentStatistic(statisticsResponse[statisticsResponse.length - 1]);
      let publicGamesStartedSum = 0;
      let publicGamesFinishedSum = 0;
      let privateGamesStartedSum = 0;
      let privateGamesFinishedSum = 0;
      for (let i = 0; i < statisticsResponse.length; i++) {
        publicGamesStartedSum +=
          statisticsResponse[i].publicGamesStarted.length;
        publicGamesFinishedSum +=
          statisticsResponse[i].publicGamesFinished.length;
        privateGamesFinishedSum +=
          statisticsResponse[i].privateGamesStarted.length;
        privateGamesFinishedSum +=
          statisticsResponse[i].privateGamesFinished.length;
      }
      setPublicGamesStarted(publicGamesStartedSum);
      setPublicGamesFinished(publicGamesFinishedSum);
      setPrivateGamesStarted(privateGamesStartedSum);
      setPrivateGamesFinished(privateGamesFinishedSum);
    }
  };

  return (
    <Stack mt={8} mb={-12.5}>
      <div>
        <Grid container spacing={4} justifyContent="left">
          <Grid item xs={5} style={{ textAlign: "center" }}>
            <Card style={{ background: "#ffffff9e" }} sx={{ minWidth: 300 }}>
              <CardContent>
                <h1>ESTADISTICAS DEL MES</h1>
                <Stack mt={2}>
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
                <Stack mt={2}>
                  <b>Partidas publicas finalizadas </b>
                  <Button
                    variant="contained"
                    type="submit"
                    style={{ background: "#053742" }}
                    disableRipple={true}
                  >
                    {publicGamesFinished}
                  </Button>
                </Stack>
                <Stack mt={2}>
                  <b>Partidas privadas finalizadas </b>
                  <Button
                    variant="contained"
                    type="submit"
                    style={{ background: "#053742" }}
                    disableRipple={true}
                  >
                    {privateGamesFinished}
                  </Button>
                </Stack>
                <Stack mt={2}>
                  <b>Partidas privadas finalizadas </b>
                  <Button
                    variant="contained"
                    type="submit"
                    style={{ background: "#053742" }}
                    disableRipple={true}
                  >
                    {privateGamesFinished}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </Stack>
  );
}
