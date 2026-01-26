import type { HabitAIRequest, HabitAIResponse, HabitRequest, HabitResponse, HabitStreakResponse, HabitTrackRequest, TodoAIRequest, TodoAIResponse, TodoRequest, TodoResponse, TopHabit } from '../types/productivity';
import apiInstance from './apiInstance';
import { AxiosError } from 'axios';

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    return data?.message || data?.error || fallback;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
};

export const productivityService = {

  addTodo: async (data: TodoRequest): Promise<TodoResponse> => {
    try {
      const response = await apiInstance.post<TodoResponse>('/productivity/todo/add', data);
      return response.data;
    } catch (error: unknown) {
      throw getErrorMessage(error, 'Gagal bikin task baru nih!');
    }
  },

  getTodos: async () => {
    try {
      const response = await apiInstance.get('/productivity/todo/all');
      return response.data;
    } catch (error: unknown) {
      throw getErrorMessage(error, 'Gagal narik data To Do List!');
    }
  },

  getTodoById: async (id: number) => {
    try {
      const response = await apiInstance.get(`/productivity/todo/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw getErrorMessage(error, 'Task-nya nggak ketemu!');
    }
  },

  updateTodo: async (id: number, data: Partial<TodoRequest>) => {
    try {
      const response = await apiInstance.put(`/productivity/todo/edit/${id}`, data);
      return response.data;
    } catch (error: unknown) {
      throw getErrorMessage(error, 'Gagal update task!');
    }
  },

  deleteTodo: async (id: number) => {
    try {
      const response = await apiInstance.delete(`/productivity/todo/delete/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw getErrorMessage(error, 'Gagal hapus task!');
    }
  },

  addTodoAI: async (data: TodoAIRequest): Promise<TodoAIResponse> => {
    try {
      const response = await apiInstance.post<TodoAIResponse>('/productivity/todo/add-ai', data);
      return response.data;
    } catch (error: unknown) {
      throw getErrorMessage(error, 'AI-nya lagi pusing, gagal generate task nih!');
    }
  },

  addHabit: async (data: HabitRequest): Promise<HabitResponse> => {
    try {
      const response = await apiInstance.post<HabitResponse>('/productivity/habit/add', data);
      return response.data;
    } catch (error: unknown) {
      throw getErrorMessage(error, 'Gagal nambahin kebiasaan baru nih!');
    }
  },

  getHabits: async () => {
    try {
      const response = await apiInstance.get('/productivity/habit/all');
      return response.data;
    } catch (error: unknown) {
      throw getErrorMessage(error, 'Gagal narik data Habits!');
    }
  },

  getHabitById: async (id: number) => {
    try {
      const response = await apiInstance.get(`/productivity/habit/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw getErrorMessage(error, 'Habit-nya nggak ketemu!');
    }
  },

  updateHabit: async (id: number, data: Partial<HabitRequest>) => {
    try {
      const response = await apiInstance.put(`/productivity/habit/edit/${id}`, data);
      return response.data;
    } catch (error: unknown) {
      throw getErrorMessage(error, 'Gagal update habit!');
    }
  },

  deleteHabit: async (id: number) => {
    try {
      const response = await apiInstance.delete(`/productivity/habit/delete/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw getErrorMessage(error, 'Gagal hapus habit!');
    }
  },
  
  getTopHabits: async (): Promise<{ data: TopHabit[] }> => {
    try {
      const response = await apiInstance.get('/productivity/habit/top');
      return response.data;
    } catch (error: unknown) {
      throw getErrorMessage(error, 'Gagal narik data statistik habit!');
    }
  },

  addHabitAI: async (data: HabitAIRequest): Promise<HabitAIResponse> => {
    try {
      const response = await apiInstance.post<HabitAIResponse>('/productivity/add-with-ai', data);
      return response.data;
    } catch (error: unknown) {
      throw getErrorMessage(error, 'AI-nya gagal bikin habit, coba lagi nanti cuy!');
    }
  },

  trackHabit: async (habitId: number, data: HabitTrackRequest): Promise<HabitStreakResponse> => {
    try {
      const response = await apiInstance.post<HabitStreakResponse>(`/productivity/habit/track/${habitId}`, data);
      return response.data;
    } catch (error: unknown) {
      throw getErrorMessage(error, 'Gagal update status habit hari ini!');
    }
  },

  getHabitStreak: async (habitId: number): Promise<HabitStreakResponse> => {
    try {
      const response = await apiInstance.get<HabitStreakResponse>(`/productivity/habit/tracking/${habitId}`);
      return response.data;
    } catch (error: unknown) {
      throw getErrorMessage(error, 'Gagal ambil data histori habit!');
    }
  },

  getNotifications: async () => {
    try {
      const response = await apiInstance.get('/productivity/notification/get');
      return response.data;
    } catch (error: unknown) {
      throw getErrorMessage(error, 'Gagal ambil notifikasi!');
    }
  },

  readAllNotifications: async () => {
    try {
      const response = await apiInstance.put('/productivity/notification/read-all');
      return response.data;
    } catch (error: unknown) {
      throw getErrorMessage(error, 'Gagal tandai semua notifikasi!');
    }
  },

  clearAllNotifications: async () => {
    try {
      const response = await apiInstance.delete('/productivity/notification/clear-all');
      return response.data;
    } catch (error: unknown) {
      throw getErrorMessage(error, 'Gagal hapus semua notifikasi!');
    }
  },

};