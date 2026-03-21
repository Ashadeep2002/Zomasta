import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export function getApiErrorMessage(error, fallbackMessage = 'Something went wrong.') {
  return error?.response?.data?.message || fallbackMessage;
}

export default api;
