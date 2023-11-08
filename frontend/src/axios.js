import axios from "axios";

const instance = axios.create({
  baseURL: "https://chat-app-aftab.onrender.com",
  // baseURL: "http://localhost:4200",
  withCredentials: true,
});
export default instance;
