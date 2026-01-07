import type { RoadmapAIRequest, RoadmapAIResponse, RoadmapStep, SkillRequest, SkillResponse } from '../types/goal';
import type { HabitAIRequest, HabitAIResponse, HabitRequest, HabitResponse, HabitStreakResponse, HabitTrackRequest, TodoAIRequest, TodoAIResponse, TodoRequest, TodoResponse, TopHabit } from '../types/productivity';
import apiInstance from './apiInstance';

export const productivityService = {

  addTodo: async (data: TodoRequest): Promise<TodoResponse> => {
    try {
      const response = await apiInstance.post<TodoResponse>('/productivity/todo/add', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Gagal bikin task baru nih!';
    }
  },

  getTodos: async () => {
    try {
      const response = await apiInstance.get('/productivity/todo/all');
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Gagal narik data To Do List!';
    }
  },

  getTodoById: async (id: number) => {
    try {
      const response = await apiInstance.get(`/productivity/todo/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Task-nya nggak ketemu!';
    }
  },

  updateTodo: async (id: number, data: Partial<TodoRequest>) => {
    try {
      const response = await apiInstance.put(`/productivity/todo/edit/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Gagal update task!';
    }
  },

  deleteTodo: async (id: number) => {
    try {
      const response = await apiInstance.delete(`/productivity/todo/delete/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Gagal hapus task!';
    }
  },

  addTodoAI: async (data: TodoAIRequest): Promise<TodoAIResponse> => {
    try {
      const response = await apiInstance.post<TodoAIResponse>('/productivity/todo/add-ai', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'AI-nya lagi pusing, gagal generate task nih!';
    }
  },

  addHabit: async (data: HabitRequest): Promise<HabitResponse> => {
    try {
      const response = await apiInstance.post<HabitResponse>('/productivity/habit/add', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Gagal nambahin kebiasaan baru nih!';
    }
  },

  getHabits: async () => {
    try {
      const response = await apiInstance.get('/productivity/habit/all');
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Gagal narik data Habits!';
    }
  },

  getHabitById: async (id: number) => {
    try {
      const response = await apiInstance.get(`/productivity/habit/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Habit-nya nggak ketemu!';
    }
  },

  updateHabit: async (id: number, data: Partial<HabitRequest>) => {
    try {
      const response = await apiInstance.put(`/productivity/habit/edit/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Gagal update habit!';
    }
  },

  deleteHabit: async (id: number) => {
    try {
      const response = await apiInstance.delete(`/productivity/habit/delete/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Gagal hapus habit!';
    }
  },
  
  getTopHabits: async (): Promise<{ data: TopHabit[] }> => {
    try {
      const response = await apiInstance.get('/productivity/habit/top');
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Gagal narik data statistik habit!';
    }
  },

  addHabitAI: async (data: HabitAIRequest): Promise<HabitAIResponse> => {
    try {
      const response = await apiInstance.post<HabitAIResponse>('/productivity/add-with-ai', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'AI-nya gagal bikin habit, coba lagi nanti cuy!';
    }
  },

  trackHabit: async (habitId: number, data: HabitTrackRequest): Promise<HabitStreakResponse> => {
    try {
      const response = await apiInstance.post<HabitStreakResponse>(`/productivity/habit/track/${habitId}`, data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Gagal update status habit hari ini!';
    }
  },

  getHabitStreak: async (habitId: number): Promise<HabitStreakResponse> => {
    try {
      const response = await apiInstance.get<HabitStreakResponse>(`/productivity/habit/tracking/${habitId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Gagal ambil data histori habit!';
    }
  },

};