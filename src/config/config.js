import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:3000', 
  baseURL: 'https://note-app-backend-six.vercel.app', 
  withCredentials: true,
});


export default api;
