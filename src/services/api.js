import axios from "axios";
import config from "../config";

const api = axios.create({
  baseURL: config.API_BASE_URL + "/",
});
const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Math.floor(Date.now() / 1000);
    return now >= payload.exp - 60;
  } catch (error) {
    return true;
  }
};

const refreshToken = async () => {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) {
    throw new Error("No refresh token available");
  }

  const response = await axios.post(
    `${config.API_BASE_URL}/users/token/refresh/`,
    { refresh },
  );

  const { access } = response.data;
  localStorage.setItem("access", access);
  return access;
};
api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("access");
  console.log("Sending token:", token);
  const publicEndpoints = ["/register/", "/token/", "/token/refresh/"];
  const isPublic = publicEndpoints.some((endpoint) =>
    config.url.includes(endpoint),
  );
  if (!isPublic) {
    let token = localStorage.getItem("access");
    if (isTokenExpired(token)) {
      try {
        token = await refreshToken();
      } catch (error) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
