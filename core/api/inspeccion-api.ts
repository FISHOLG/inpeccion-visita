import axios from "axios";

export const inspeccionApi = axios.create({
  baseURL: process.env.EXPO_PUBLIC_RELEVOS_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
