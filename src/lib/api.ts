import axios from "axios";

// Di Next.js App Router (Client Components), jika baseURL adalah "/api",
// ia akan menambahkan "/api" di belakang origin domain (misal ngrok-anda.com/api).
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
