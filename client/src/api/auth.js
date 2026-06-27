import axios from "axios";

const API = "https://eventsphere-backend-ijp4.onrender.com";

export const registerUser = (data) => {
  return axios.post(`${API}/register`, data);
};

export const loginUser = (data) => {
  return axios.post(`${API}/login`, data);
};

export const getDashboard = (token) => {
  return axios.get(`${API}/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};