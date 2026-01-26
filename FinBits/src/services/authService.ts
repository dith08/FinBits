import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../types/auth';
import apiInstance from './apiInstance';
import { AxiosError } from 'axios';

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://api-finbits.rplrus.com';

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

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await apiInstance.post<LoginResponse & { refresh_token?: string }>('/auth/signin', credentials);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user_id', response.data.user_id.toString());
        if (response.data.refresh_token) {
          localStorage.setItem('refresh_token', response.data.refresh_token);
        }
      }
      
      return response.data;
    } catch (error: unknown) {
      throw getErrorMessage(error, 'Waduh, login gagal nih. Cek lagi ya!');
    }
  },

  register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
    try {
      const response = await apiInstance.post<RegisterResponse>('/auth/signup', userData);
      return response.data;
    } catch (error: unknown) {
      throw getErrorMessage(error, 'Registrasi gagal, coba lagi ya!');
    }
  },

  googleSignIn: () => {
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  },

  handleGoogleCallback: (token: string, userId: string, refreshToken?: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user_id', userId);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
  },

  logout: async () => {
    try {
      await apiInstance.post('/auth/logout');
    } catch {
    }
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_id');
  },

  forceLogout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_id');
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  getUserId: (): string | null => {
    return localStorage.getItem('user_id');
  },

  getProfile: async () => {
    try {
      const response = await apiInstance.get('/auth/my-profile');
      return response.data;
    } catch (error: unknown) {
      throw getErrorMessage(error, 'Gagal memuat profil');
    }
  },

  addProfile: async (data: {
    image_url?: string;
    description?: string;
    main_skill?: string;
    sub_skill?: string;
    interest?: string;
    note?: string;
    motivation?: string;
    full_name?: string;
  }) => {
    try {
      const response = await apiInstance.post('/auth/add', data);
      return response.data;
    } catch (error: unknown) {
      throw getErrorMessage(error, 'Gagal menambahkan profil');
    }
  },

  editProfile: async (data: {
    image_url?: string;
    description?: string;
    main_skill?: string;
    sub_skill?: string;
    interest?: string;
    note?: string;
    motivation?: string;
    full_name?: string;
  }) => {
    try {
      const response = await apiInstance.put('/auth/edit', data);
      return response.data;
    } catch (error: unknown) {
      throw getErrorMessage(error, 'Gagal memperbarui profil');
    }
  }
};