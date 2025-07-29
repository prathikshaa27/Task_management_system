let baseURL;

if (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) {
  baseURL = import.meta.env.VITE_API_URL;
} else {
  // Fallback for Jest (mocked in tests anyway)
  baseURL = "http://localhost:8000/api";
}

export default {
  API_BASE_URL: baseURL,
};
