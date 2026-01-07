import type {
  AddTargetAIRequest,
  AddTargetAIResponse,
  GoalRequest,
  GoalResponse,
  HealthCheckRequest,
  HealthCheckResponse,
  RoadmapAIRequest,
  RoadmapAIResponse,
  RoadmapStep,
  SkillBoostAIRequest,
  SkillBoostAIResponse,
  SkillBoostToGoalRequest,
  SkillBoostToGoalResponse,
  SkillRequest,
  SkillResponse,
} from "../types/goal";
import apiInstance from "./apiInstance";

export const goalService = {
  addGoal: async (data: GoalRequest): Promise<GoalResponse> => {
    try {
      const response = await apiInstance.post<GoalResponse>("goals/add", data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || "Gagal nambahin target goal lu!";
    }
  },

  getGoals: async () => {
    try {
      const response = await apiInstance.get("/goals");
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || "Gagal narik data goals!";
    }
  },

  getGoalById: async (id: number) => {
    try {
      const response = await apiInstance.get(`/goals/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || "Detail goal nggak ketemu!";
    }
  },

  updateGoal: async (id: number, data: Partial<GoalRequest>) => {
    try {
      const response = await apiInstance.put(`/goals/edit/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || "Gagal update goal!";
    }
  },

  deleteGoal: async (id: number) => {
    try {
      const response = await apiInstance.delete(`/goals/delete/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || "Gagal hapus goal!";
    }
  },

  generateRoadmapAI: async (goalId: number, data: RoadmapAIRequest): Promise<RoadmapAIResponse> => {
    try {
      const response = await apiInstance.post<RoadmapAIResponse>(
        `/goals/roadmapsai/add/${goalId}`, 
        data
      );
      return response.data;
    } catch (error: any) {
      throw (
        error.response?.data?.message ||
        "Gagal generate roadmap, AI-nya lagi pusing cuy!"
      );
    }
  },

  getRoadmapByGoal: async (goalId: number): Promise<RoadmapAIResponse> => {
    try {
      const response = await apiInstance.get<RoadmapAIResponse>(
        `/goals/roadmapsai/${goalId}`
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || "Gagal ambil data roadmap!";
    }
  },

  updateRoadmapStep: async (
    roadmapId: number,
    data: Partial<RoadmapStep>
  ): Promise<RoadmapAIResponse> => {
    try {
      const response = await apiInstance.put<RoadmapAIResponse>(
        `/goals/roadmapsai/edit/step/${roadmapId}`,
        data
      );
      return response.data;
    } catch (error: any) {
      throw (
        error.response?.data?.message || "Gagal update langkah roadmap-nya nih!"
      );
    }
  },

  deleteRoadmapStep: async (
    roadmapId: number
  ): Promise<{ message: string }> => {
    try {
      const response = await apiInstance.delete<{ message: string }>(
        `/goals/roadmapsai/delete/${roadmapId}`
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || "Gagal hapus langkah roadmap!";
    }
  },

  generateRoadmapFromImage: async (goalId: number, file: File): Promise<RoadmapAIResponse> => {
    try {
      const formData = new FormData();
      formData.append("image", file); 

      const response = await apiInstance.post<RoadmapAIResponse>(
        `/goals/roadmaps/add/${goalId}`, 
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw (
        error.response?.data?.message ||
        "Gagal baca gambar roadmap, pastiin fotonya jelas ya!"
      );
    }
  },

  getRoadmapImageByGoal: async (goalId: number): Promise<RoadmapAIResponse> => {
    try {
      const response = await apiInstance.get<RoadmapAIResponse>(
        `/goals/roadmaps/${goalId}`
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || "Gagal narik data roadmap gambar!";
    }
  },

  updateRoadmapImageStep: async (
    roadmapId: number,
    data: Partial<RoadmapStep>
  ): Promise<RoadmapAIResponse> => {
    try {
      const response = await apiInstance.put<RoadmapAIResponse>(
        `/goals/roadmaps/edit/${roadmapId}`,
        data
      );
      return response.data;
    } catch (error: any) {
      throw (
        error.response?.data?.message || "Gagal update langkah roadmap gambar!"
      );
    }
  },

  deleteRoadmapImageStep: async (
    roadmapId: number
  ): Promise<{ message: string }> => {
    try {
      const response = await apiInstance.delete<{ message: string }>(
        `/goals/roadmaps/delete/${roadmapId}`
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || "Gagal hapus langkah roadmap ini!";
    }
  },

  addSkill: async (data: SkillRequest): Promise<SkillResponse> => {
    try {
      const response = await apiInstance.post<SkillResponse>('/goals/skills/add', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Gagal nambahin skill baru nih!';
    }
  },

  getSkills: async () => {
    try {
      const response = await apiInstance.get('/goals/skills');
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Gagal narik data skill!';
    }
  },

  updateSkill: async (id: number, data: Partial<SkillRequest> & { progress_percentage?: number }) => {
    try {
      const response = await apiInstance.put(`/goals/skills/edit/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Gagal update progres skill!';
    }
  },

  deleteSkill: async (id: number) => {
    try {
      const response = await apiInstance.delete(`/goals/skills/delete/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Gagal hapus skill!';
    }
  },

  generateSkillBoostPlan: async (data: SkillBoostAIRequest): Promise<SkillBoostAIResponse> => {
    try {
      const response = await apiInstance.post<SkillBoostAIResponse>('/goals/plan', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'AI-nya gagal bikin rencana belajar, coba lagi nanti ya!';
    }
  },

  getSkillBoostPlan: async (planId: number): Promise<SkillBoostAIResponse> => {
    try {
      const response = await apiInstance.get<SkillBoostAIResponse>(`/goals/plan/${planId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Gagal ambil data rencana belajar!';
    }
  },

  checkInConsistency: async (data: HealthCheckRequest): Promise<{ message: string }> => {
    try {
      const response = await apiInstance.post<{ message: string }>('/goals/checkin', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Gagal nyatet konsistensi lu, coba lagi nanti!';
    }
  },

  getHealthStatus: async (): Promise<HealthCheckResponse> => {
    try {
      const response = await apiInstance.get<HealthCheckResponse>('/goals/healthcheck');
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Gagal narik data audit kesehatan goal!';
    }
  },

  addTargetGoalAI: async (data: AddTargetAIRequest): Promise<AddTargetAIResponse> => {
    try {
      const response = await apiInstance.post<AddTargetAIResponse>('/goals/addgoals', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'AI gagal nge-generate target, coba lagi ya!';
    }
  },

  addSkillBoostToGoalAI: async (planId: number): Promise<SkillBoostToGoalResponse> => {
    try {
      const response = await apiInstance.post<SkillBoostToGoalResponse>(
        `/goals/plan/${planId}/to-goal`
      );
      return response.data;
    } catch (error: any) {
      throw (
        error.response?.data?.message || 
        'Gagal naikin status skill jadi goal, coba lagi nanti ya!'
      );
    }
  },
};
