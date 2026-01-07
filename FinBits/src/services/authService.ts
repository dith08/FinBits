import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../types/auth';
import apiInstance from './apiInstance';


export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await apiInstance.post<LoginResponse>('/auth/signin', credentials);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user_id', response.data.user_id.toString());
      }
      
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Waduh, login gagal nih. Cek lagi ya!';
    }
  },

  register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
    try {
      const response = await apiInstance.post<RegisterResponse>('/auth/signup', userData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Registrasi gagal, coba lagi ya!';
    }
  },

  googleSignIn: async (idToken: string): Promise<LoginResponse> => {
    try {
      const response = await apiInstance.post<LoginResponse>('/auth/google', {
        token: idToken 
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user_id', response.data.user_id.toString());
      }

      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Gagal login pake Google, coba lagi cuy!';
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    window.location.href = '/login';
  }
};