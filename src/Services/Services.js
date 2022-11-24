import axios from "axios";

const baseUrl = process.env.REACT_APP_4_IN_ROW_BASE_URL;

async function GetAllStatistics() {
  try {
    const response = await axios({
      url: `${baseUrl}/statistics`,
      method: "GET",
    });
    return response.data;
  } catch (err) {
    console.error(err);
  }
  return [];
}

async function GetStatisticsOfDate(day, month, year) {
  try {
    const response = await axios({
      url: `${baseUrl}/statistics/get/${day}/${month}/${year}`,
      method: "GET",
    });
    return response.data;
  } catch (err) {
    console.error(err);
  }
}

async function SaveNewDataOfStatistics(gameId, gameType, gameState) {
  const userCountry = GetUserCountry();
  try {
    const response = await axios({
      url: `${baseUrl}/statistics/${gameId}/${gameType}/${gameState}/${userCountry}`,
      method: "POST",
    });
    return response.data;
  } catch (err) {
    console.error(err);
  }
  return [];
}

function GetUserCountry() {
  try {
    const data = Intl.DateTimeFormat()
      .resolvedOptions()
      .timeZone.replace(" ", "_");
    return data.split("/")[1];
  } catch (err) {
    console.log(err);
    return "DESCONOCIDO";
  }
}

const services = {
  GetAllStatistics,
  GetStatisticsOfDate,
  SaveNewDataOfStatistics,
};

export default services;
