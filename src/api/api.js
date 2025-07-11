// src/api/api.js
import axios from "axios";

const BASE_URL = "http://localhost:5000"; // or your deployed backend URL

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// export const registerUser = (data) => api.post("/auth/register", data);
// export const loginUser = (data) => api.post("/auth/login", data);
// export const fetchQuiz = () => api.get("/quiz");
// export const submitQuiz = (data) => api.post("/quiz/submit", data);
// export const getCertificate = (userId) => api.get(`/certificate/${userId}`);
// export const fetchLessons = (track) => api.get(`/lessons/${track}`);

// export const completeLesson = (lessonId) => api.post(`/lessons/${lessonId}/complete`);