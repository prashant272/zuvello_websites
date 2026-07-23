const isDev = window.location.hostname === 'localhost';
export const API_BASE_URL = isDev ? 'http://localhost:5000/api' : '/api';
