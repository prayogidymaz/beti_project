import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api", // ganti jika URL backend-mu beda
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
