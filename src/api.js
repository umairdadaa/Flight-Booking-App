// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://flight-booking-backend-04p7.onrender.com/api', // Replace with your actual IP
});

export default api;

