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

async function GetStatisticsOfDate() {
  try {
    const response = await axios({
      url: `${baseUrl}/statistics/get`,
      method: "GET",
    });
    return response.data;
  } catch (err) {
    console.error(err);
  }
  return [];
}

async function SaveNewDataOfStatistics(gameId, gameType, gameState) {
  const userCountry = await GetUserCountry();
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

async function GetUserCountry() {
  try {
    const response = await axios({
      url: `https://ipinfo.io`,
      method: "GET",
    });
    return response.country;
  } catch (err) {
    console.error(err);
  }
  return "DESCONOCIDO";
}

const services = {
  GetAllStatistics,
  GetStatisticsOfDate,
  SaveNewDataOfStatistics,
};

export default services;
