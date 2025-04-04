import axios from "axios";

// const token =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YWY5NjZhYWExMjY0NDZjNTBlMTI2YyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcxMTk2MDI3OSwiZXhwIjoxNzEyMDQ2Njc5fQ.Ne8AfGoh7vzfxSvz9jYjlrHtqyc0r7O39fxLjLerfkI";

export const authenticatedInstance = axios.create({
  baseURL: "http://localhost:3000",
});

authenticatedInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Create an Axios instance without token
export const unauthenticatedInstance = axios.create({
  baseURL: "http://localhost:3000",
  // baseURL: "https://shopvista-backend.onrender.com",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

unauthenticatedInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
