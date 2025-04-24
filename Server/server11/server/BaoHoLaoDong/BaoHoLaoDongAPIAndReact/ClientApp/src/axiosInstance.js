import axios from 'axios';

let token = null;
let axiosInstance = null; // 👈 Không tạo ngay, chờ có BASE_URL

export const setAxiosInstance = (authToken) => {
    token = authToken;

    // Khởi tạo lại axiosInstance mỗi lần có baseURL mới
    axiosInstance = axios.create();

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

export default
new Proxy({}, {
    get: function (_, prop) {
        if (!axiosInstance) {
            throw new Error("Bạn phải gọi setAxiosInstance() trước khi sử dụng axiosInstance.");
        }
        return axiosInstance[prop];
    }
});
