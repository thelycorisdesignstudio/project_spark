import api from './api';

export const authService = {
  register: async (email: string, password: string, displayName: string) => {
    const { data } = await api.post('/auth/register', { email, password, displayName });
    localStorage.setItem('spark_access_token', data.accessToken);
    return data;
  },

  login: async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('spark_access_token', data.accessToken);
    return data;
  },

  childLogin: async (parentId: string, profileId: string, pin: string) => {
    const { data } = await api.post('/auth/child/login', { parentId, profileId, pin });
    localStorage.setItem('spark_access_token', data.accessToken);
    return data; // { accessToken, profile }
  },

  lookupProfiles: async (email: string) => {
    const { data } = await api.post('/auth/child/lookup', { email });
    return data; // { parentId, profiles: [{ _id, displayName, avatarColor }] }
  },

  logout: async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('spark_access_token');
  },

  getMe: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },

  refresh: async () => {
    const { data } = await api.post('/auth/refresh');
    localStorage.setItem('spark_access_token', data.accessToken);
    return data;
  },
};
