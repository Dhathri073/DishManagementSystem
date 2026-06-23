/**
 * Axios instance and dish API helpers.
 * Base URL is read from VITE_API_BASE_URL env variable.
 */

import axios from "axios";

// In dev, leave baseURL empty so Vite's proxy handles /api/* (avoids CORS).
// In production, set VITE_API_BASE_URL to your deployed backend URL.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Response interceptor for global error normalisation
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.detail || err.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export const dishApi = {
  /** Fetch all dishes */
  getAll: () => api.get("/api/dishes").then((r) => r.data),

  /** Create a dish */
  create: (data) => api.post("/api/dishes", data).then((r) => r.data),

  /** Toggle published status */
  toggle: (dishId) =>
    api.patch(`/api/dishes/${dishId}/toggle`).then((r) => r.data),

  /** Delete a dish */
  delete: (dishId) => api.delete(`/api/dishes/${dishId}`),

  /** Upload an image file, returns { imageUrl: "data:..." } */
  uploadImage: (file) => {
    const form = new FormData();
    form.append("file", file);
    // Do NOT set Content-Type — let the browser set it with the correct boundary
    return api
      .post("/api/dishes/upload-image", form, {
        headers: { "Content-Type": undefined },
      })
      .then((r) => r.data);
  },

  /** Recent activity log */
  getActivities: () => api.get("/api/activities").then((r) => r.data),
};
