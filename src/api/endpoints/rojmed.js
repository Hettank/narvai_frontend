import api from '../axios';

const API_GROUP = '/rojmed';

export const rojmedAPI = {
  getAll: params => api.get(`${API_GROUP}`, { params }),
  create: data => api.post(`${API_GROUP}`, data),
  update: data => api.patch(`${API_GROUP}/update`, data),
};
