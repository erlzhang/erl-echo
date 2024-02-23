import axios from 'axios';

axios.interceptors.request.use(config => {
  config.headers['Authentication'] = `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
  return config;
})

export const BASE_URL = process.env.NEXT_PUBLIC_API;