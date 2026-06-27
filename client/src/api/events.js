import axios from "axios";

const API = "https://eventsphere-backend-ijp4.onrender.com";

export const getEvents = () => axios.get(`${API}/events`);

export const createEvent = (data) =>
  axios.post(`${API}/events`, data);

export const registerEvent = (data) =>
  axios.post(`${API}/events/register`, data);