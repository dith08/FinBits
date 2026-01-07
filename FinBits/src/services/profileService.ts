import type { ProfileRequest, ProfileResponse } from "../types/profile";
import apiInstance from "./apiInstance";

export const profileService = {
  addProfile: async (data: ProfileRequest): Promise<ProfileResponse> => {
    try {
      const response = await apiInstance.post<ProfileResponse>(
        "/auth/add",
        data
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || "Gagal bikin profil baru nih!";
    }
  },
  getProfile: async (): Promise<ProfileResponse> => {
    try {
      const response = await apiInstance.get<ProfileResponse>("/auth/my-profile");
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || "Gagal narik data profil lu!";
    }
  },

  updateProfile: async (data: ProfileRequest): Promise<ProfileResponse> => {
    try {
      const response = await apiInstance.put<ProfileResponse>("/auth/edit", data);
      return response.data;
    } catch (error: any) {
      throw (
        error.response?.data?.message ||
        "Gagal update profil, coba cek koneksi lu!"
      );
    }
  },

  deleteProfile: async (): Promise<{ message: string }> => {
    try {
      const response = await apiInstance.delete<{ message: string }>(
        "/profile"
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || "Gagal hapus profil!";
    }
  },
};
