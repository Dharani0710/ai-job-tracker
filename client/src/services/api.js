import axios from "axios";

const API = axios.create({
  baseURL: "https://ai-job-tracker-nh4e.onrender.com/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  // ❌ do NOT send token for login & register
  const isAuthRoute =
    req.url.includes("/auth/login") ||
    req.url.includes("/auth/register");

  if (token && !isAuthRoute) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;
