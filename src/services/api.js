import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/",
});

api.interceptors.request.use((config)=>{
    const token = localStorage.getItem("access");
    console.log("Sending token:", token);
    const publicEndpoints = ["/register/", "/users/token/", "/token/", "/token/refresh/"];
    const isPublic = publicEndpoints.some((endpoint) => config.url.includes(endpoint));
    if (token && !isPublic) {
    config.headers.Authorization =  `Bearer ${token}`;   
    } 
    return config;
});

export default api;