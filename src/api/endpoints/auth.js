import api from '../axios.js';

export const authAPI = {
  register: async credentials => {
    const response = await api.post('/auth/register', credentials);
    return response;
  },

  login: async credentials => {
    const response = await api.post('/auth/login', credentials);
    return response;
  },
};
