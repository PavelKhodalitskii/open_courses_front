import { useAuth } from '@/contexts/AuthContext';
import { getCookie } from '@/utils/cookie';
import axios from 'axios';

const apiClient = axios.create({
    baseURL: '/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const initCsrfToken = async () => {
    try {
        await apiClient.get('/auths/csrf/');
    } catch (error) {
        console.error('CSRF токен не получен:', error);
    }
};

apiClient.interceptors.request.use((config) => {
    const csrfToken = getCookie('csrftoken');
    if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const {logout} = useAuth();
        if (error.response.status === 401) {
            logout();
        }
        return Promise.reject(error);
    }
);

export default apiClient;