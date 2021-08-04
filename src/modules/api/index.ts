import axios from "axios";

const weatherApi = axios.create({
  baseURL: process.env.OMW_WEATHER_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

weatherApi.interceptors.request.use((config) => {
  return {
    ...config,
    url: config.url?.concat(`&appId=${process.env.OMW_API_KEY}`),
  };
});

const geoApi = axios.create({
  baseURL: process.env.OMW_GEO_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

geoApi.interceptors.request.use((config) => {
  return {
    ...config,
    url: config.url?.concat(`&appId=${process.env.OMW_API_KEY}`),
  };
});

const api = {
  geo: geoApi,
  weather: weatherApi,
};

export default api;
