import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);
export const getMe = () => api.get("/auth/me");

export async function getTasks() {
  return (await api.get("/tasks")).data;
}

export async function createTask(task) {
  return (await api.post("/tasks", task)).data;
}

export async function updateTask(id, task) {
  return (await api.put(`/tasks/${id}`, task)).data;
}

export async function deleteTask(id) {
  return (await api.delete(`/tasks/${id}`)).data;
}

export async function getDashboard() {
  return (await api.get("/tasks/dashboard")).data;
}
