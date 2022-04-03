import axios from 'axios';
import Cookies from 'js-cookie';

import { APP_CONFIG } from '../config';

const api = axios.create({
    baseURL: APP_CONFIG.API_URL,
    headers: { 'Content-Type': 'application/json' },
});

const tokenInterceptor = (config) => {
    config.headers.Authorization = Cookies.get('user-token') || '';
    return config;
};
api.interceptors.request.use(tokenInterceptor);

export default api;
