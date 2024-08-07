import axios from "axios";

const headers = {
  Accept: "aplication/json",
  "Content-Type": "aplication/json",
  "Cache-Control": "no-cache",
  Expires: 0,
};

const instance = axios.create({
  baseURL: process.env.DOMAIN,
  headers,
  timeout: 60 * 1000,
});

instance.interceptors.response.use(
  (config) => config,
  (error) => Promise.reject(error)
);

instance.interceptors.request.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default instance;
