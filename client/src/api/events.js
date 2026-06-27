import axios from "axios";

const API = "http://localhost:5000";

export const getEvents = () => axios.get(`${API}/events`);

export const createEvent = (data) =>
  axios.post(`${API}/events`, data);

export const registerEvent = (data) =>
  axios.post(`${API}/events/register`, data);