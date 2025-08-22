import axios from 'axios';
import { baseURL } from './baseURLvariable';


const axiosClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});


axiosClient.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


axiosClient.interceptors.response.use(
  (response) => {

    if (response.data && response.data.status) {
      if (response.data.status.success) {

        return response.data.data;
      } else {

        return Promise.reject(new Error(response.data.status.displayMessage));
      }
    }


    return response.data;
  },
  (error) => {

    let errorMessage = 'Đã xảy ra lỗi không xác định';

    if (error.response) {

      const { status } = error.response;


      if (status === 401) {

        localStorage.removeItem('authToken');
        localStorage.removeItem('user');


        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }


      if (status === 403) {

        localStorage.removeItem('authToken');
        localStorage.removeItem('user');


        window.location.href = '/login?error=access_denied';
      }

      if (error.response.data && error.response.data.status) {
        errorMessage = error.response.data.status.displayMessage;
      } else if (error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else {
        errorMessage = `Lỗi ${error.response.status}: ${error.response.statusText}`;
      }
    } else if (error.request) {

      errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng và thử lại.';
    } else {

      errorMessage = error.message;
    }

    return Promise.reject(new Error(errorMessage));
  }
);

export default axiosClient;
