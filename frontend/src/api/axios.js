import axios from 'axios';

const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:9003/api').replace(/\/$/, '');
const backendUrl = apiUrl.replace(/\/api$/, '');

const api = axios.create({
  baseURL: apiUrl,
});

export const getImageUrl = (imagePath) => {
  if (!imagePath || imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  return `${backendUrl}${imagePath}`;
};

export default api;
