/**
 * Axios instance and API helpers.
 * In dev, baseURL is empty — Vite proxy forwards /api, /uploads, /ws to backend.
 * In production, set VITE_API_BASE_URL to your deployed backend URL.
 */
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.detail || err.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export const dishApi = {
  // ── Admin ──────────────────────────────────────────────────────────────────
  getAll: () => api.get("/api/dishes").then((r) => r.data),
  create: (data) => api.post("/api/dishes", data).then((r) => r.data),
  update: (dishId, data) => api.patch(`/api/dishes/${dishId}`, data).then((r) => r.data),
  toggle: (dishId) => api.patch(`/api/dishes/${dishId}/toggle`).then((r) => r.data),
  delete: (dishId) => api.delete(`/api/dishes/${dishId}`),
  uploadImage: (file) => {
    const form = new FormData();
    form.append("file", file);
    return api.post("/api/dishes/upload-image", form, {
      headers: { "Content-Type": undefined },
    }).then((r) => r.data);
  },

  // ── Public menu ────────────────────────────────────────────────────────────
  getMenu: () => api.get("/api/menu").then((r) => r.data),
  getMenuDish: (dishId) => api.get(`/api/menu/${dishId}`).then((r) => r.data),

  // ── Activities ─────────────────────────────────────────────────────────────
  getActivities: () => api.get("/api/activities").then((r) => r.data),
};
