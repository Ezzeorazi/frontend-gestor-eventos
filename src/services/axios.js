import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Ajusta el puerto si tu backend es otro
  withCredentials: false, // Cambia a true si usas cookies
});

export default api;
