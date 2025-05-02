import axios, { AxiosInstance } from "axios";

const axiosPokeApiClient: AxiosInstance = axios.create({
  baseURL: "https://pokeapi.co/api/v2",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosPokeApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("PokeAPI error:", error);
    return Promise.reject(error);
  }
);

export { axiosPokeApiClient };
