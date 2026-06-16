import apiRequest from './client.js';

export const getAdminRealtimeData = () => apiRequest('/admin/realtime');

export default {
  getAdminRealtimeData,
};
