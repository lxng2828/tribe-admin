import axiosClient from './axiosClient';

export const authService = {
  login: async (credentials) => {
    const response = await axiosClient.post('/api/auth/login', credentials);
    return response;
  },
};
