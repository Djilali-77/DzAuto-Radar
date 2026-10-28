import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000",
  timeout: 20000,
});

export const fetchStats = () => api.get("/api/stats").then((res) => res.data);

export const fetchCars = (limit = 500) =>
  api.get("/api/cars", { params: { limit } }).then((res) => res.data);

export const fetchDeals = () => api.get("/api/anomalies").then((res) => res.data);

export const fetchHistory = () => api.get("/api/history").then((res) => res.data);

export const fetchBrands = () => api.get("/api/brands").then((res) => res.data);

export const predictPrice = (brand, year) =>
  api.get("/api/predict", { params: { brand, year } }).then((res) => res.data);

// Turn any axios error into a readable message for the UI
export function getErrorMessage(error) {
  const detail = error?.response?.data?.detail;
  if (typeof detail === "string") return detail;
  // FastAPI validation errors come as a list of objects
  if (Array.isArray(detail) && detail.length > 0) return detail[0].msg;
  if (error?.code === "ERR_NETWORK") {
    return "Cannot reach the API. Is the backend running on port 8000?";
  }
  return error?.message ?? "Something went wrong.";
}