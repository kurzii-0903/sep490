import axios from 'axios';

let token = null;
let BASE_URL = null;
let axiosInstance = null; // 👈 Không tạo ngay, chờ có BASE_URL

export const setAxiosInstance = (authToken, baseURL) => {
    token = authToken;
    BASE_URL = baseURL;

    // Khởi tạo lại axiosInstance mỗi lần có baseURL mới
    axiosInstance = axios.create({
        baseURL: `${BASE_URL}/api`,
    });

    axiosInstance.interceptors.request.use(
        config => {
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        error => Promise.reject(error)
    );
};

export default new Proxy({}, {
    get: function (_, prop) {
        if (!axiosInstance) {
            throw new Error("Bạn phải gọi setAxiosInstance() trước khi sử dụng axiosInstance.");
        }
        return axiosInstance[prop];
    }
});
