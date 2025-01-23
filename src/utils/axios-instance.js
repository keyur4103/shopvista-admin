import axios from "axios";

// const token =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YWY5NjZhYWExMjY0NDZjNTBlMTI2YyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcxMTk2MDI3OSwiZXhwIjoxNzEyMDQ2Njc5fQ.Ne8AfGoh7vzfxSvz9jYjlrHtqyc0r7O39fxLjLerfkI";
const token = localStorage.getItem("token");

export const authenticatedInstance = axios.create({
  baseURL: "http://localhost:3000/",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Create an Axios instance without token
export const unauthenticatedInstance = axios.create({
  baseURL: "http://localhost:3000/",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});
