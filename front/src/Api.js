import axios from 'axios';
const API_URL = 'http://127.0.0.1:5000/tasks';

export const getTasks = () => axios.get(API_URL);
export const createTask = (title) => axios.post(API_URL, { title });
export const updateTask = (id, title) => axios.put(`${API_URL}/${id}`, { title });
export const deleteTask = (id) => axios.delete(`${API_URL}/${id}`);
