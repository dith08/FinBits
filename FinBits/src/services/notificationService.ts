import type { NotificationItem } from '../types/notification';
import apiInstance from './apiInstance';

export const notificationService = {
  getNotifications: async (): Promise<NotificationItem[]> => {
    try {
      const response = await apiInstance.get<NotificationItem[]>('/productivity/notification/get');
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Gagal narik data notifikasi!';
    }
  },

  readAllNotifications: async (): Promise<{ message: string }> => {
    try {
      const response = await apiInstance.put<{ message: string }>('/productivity/notification/read-all');
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Gagal update status notifikasi!';
    }
  },


  clearAllNotifications: async (): Promise<{ message: string }> => {
    try {
      const response = await apiInstance.delete<{ message: string }>('/productivity/notification/clear-all');
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Gagal bersihin notifikasi!';
    }
  }
};