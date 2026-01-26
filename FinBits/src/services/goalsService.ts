import apiInstance from './apiInstance';

export const goalsService = {
  getAll: async () => {
    const response = await apiInstance.get('/goals');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiInstance.get(`/goals/${id}`);
    return response.data;
  },

  add: async (data: {
    name: string;
    category: string;
    outcome: string;
    why: string;
    deadline: string;
    progress?: number;
  }) => {
    const payload = {
      goal_name: data.name,
      category: data.category,
      outcome: data.outcome,
      why: data.why,
      deadline: data.deadline,
      reminder: false, 
      progress: data.progress || 0,
    };
    
    console.log('Adding goal with payload:', payload);
    
    const response = await apiInstance.post('/goals/add', payload);
    return response.data;
  },

  edit: async (id: number, data: {
    name?: string;
    category?: string;
    outcome?: string;
    why?: string;
    deadline?: string;
    progress?: number;
    reminder?: boolean;
  }) => {
    let payload: any = {};
    
    const hasAllFields = data.name && data.category && data.outcome && 
                        data.why && data.deadline !== undefined;
    
    if (!hasAllFields) {
      console.log('Fetching current goal data for partial update...');
      try {
        const currentGoal = await apiInstance.get(`/goals/${id}`);
        const current = currentGoal.data;
        
        console.log('Current goal data:', current);
        
        payload = {
          goal_name: data.name ?? current.goal_name,
          category: data.category ?? current.category,
          outcome: data.outcome ?? current.outcome,
          why: data.why ?? current.why,
          deadline: data.deadline ?? current.deadline,
          reminder: data.reminder ?? current.reminder ?? false,
          progress_percentage: data.progress ?? current.progress_percentage ?? 0,
        };
      } catch (fetchError) {
        console.error('Failed to fetch current goal:', fetchError);
        throw new Error('Tidak dapat mengambil data goal untuk update');
      }
    } else {
      payload = {
        goal_name: data.name,
        category: data.category,
        outcome: data.outcome,
        why: data.why,
        deadline: data.deadline,
        reminder: data.reminder ?? false,
        progress_percentage: data.progress ?? 0,
      };
    }
    
    console.log('Editing goal ID:', id, 'with payload:', payload);
    
    try {
      const response = await apiInstance.put(`/goals/edit/${id}`, payload);
      return response.data;
    } catch (error: any) {
      console.error('Edit goal error details:', {
        goalId: id,
        payload,
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        fullError: error.response?.data
      });
      throw error;
    }
  },

  updateProgress: async (id: number, progress: number) => {
    console.log('Updating progress for goal ID:', id, 'to', progress);
    
    try {
      const currentGoal = await apiInstance.get(`/goals/${id}`);
      const current = currentGoal.data;
      
      console.log('Current goal data for progress update:', current);
      
      const payload = {
        goal_name: current.goal_name,
        category: current.category,
        outcome: current.outcome,
        why: current.why,
        deadline: current.deadline,
        reminder: current.reminder ?? false,
        progress_percentage: progress, 
      };
      
      console.log('Complete payload for progress update:', payload);
      
      const response = await apiInstance.put(`/goals/edit/${id}`, payload);
      return response.data;
    } catch (error: any) {
      console.error('Update progress error:', {
        goalId: id,
        progress,
        status: error.response?.status,
        message: error.response?.data?.message || error.message
      });
      throw error;
    }
  },

  delete: async (id: number) => {
    const response = await apiInstance.delete(`/goals/delete/${id}`);
    return response.data;
  },
};

export interface RoadmapResponse {
  id?: number;
  image?: string;
  image_url?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export const roadmapsService = {
  get: async (goalId: number): Promise<RoadmapResponse> => {
    const response = await apiInstance.get(`/goals/roadmaps/${goalId}`);
    return response.data;
  },

  add: async (goalId: number, data?: { image?: string; description?: string }): Promise<RoadmapResponse> => {
    const response = await apiInstance.post(`/goals/roadmaps/add/${goalId}`, data || {});
    return response.data;
  },

  edit: async (roadmapId: number, data: { image?: string; description?: string }): Promise<RoadmapResponse> => {
    const response = await apiInstance.put(`/goals/roadmaps/edit/${roadmapId}`, data);
    return response.data;
  },

  delete: async (roadmapId: number) => {
    const response = await apiInstance.delete(`/goals/roadmaps/delete/${roadmapId}`);
    return response.data;
  },
};

export interface RoadmapAIStep {
  id: number;
  step_id?: number;
  week: number;
  step_description: string;
  description?: string;
  task?: string;
  title?: string;
  completed: boolean;
  is_completed?: boolean;
}

export const roadmapsAIService = {
  get: async (goalId: number): Promise<RoadmapAIStep[]> => {
    const response = await apiInstance.get(`/goals/roadmapsai/${goalId}`);
    return response.data;
  },

  add: async (goalId: number): Promise<RoadmapAIStep[]> => {
    const response = await apiInstance.post(`/goals/roadmapsai/add/${goalId}`);
    return response.data;
  },

  editStep: async (stepId: number, data: { step_description?: string; completed?: boolean }): Promise<RoadmapAIStep> => {
    const response = await apiInstance.put(`/goals/roadmapsai/edit/step/${stepId}`, data);
    return response.data;
  },

  delete: async (goalId: number) => {
    const response = await apiInstance.delete(`/goals/roadmapsai/delete/${goalId}`);
    return response.data;
  },
};

export const healthCheckService = {
  get: async () => {
    const response = await apiInstance.get('/goals/healthcheck');
    return response.data;
  },

  checkin: async (data?: { metCommitment?: boolean; notes?: string }) => {
    const payload = {
      metCommitment: data?.metCommitment ?? true,
      notes: data?.notes ?? 'Daily check-in'
    };
    
    const response = await apiInstance.post('/goals/checkin', payload);
    return response.data;
  },
};

export const aiGoalsService = {
  addGoalsWithAI: async (target: string, category?: string) => {
    const payload = {
      target,
      category: category || 'financial',
      context: 'Generate a detailed financial goal roadmap with specific, actionable steps'
    };
    const response = await apiInstance.post('/goals/addgoals', payload);
    return response.data;
  },

  generateSkillBoost: async (skillId: number, targetLevel?: string, duration?: string) => {
    try {
      const response = await apiInstance.post(`/goals/plan`, {
        skillId,
        targetLevel,
        duration
      });
      return response.data;
    } catch (error: any) {
      console.warn('Skill boost endpoint failed, using mock data:', error.response?.data?.message);
      return {
        data: {
          weeks: [
            { week: 1, task: 'Belajar dasar dan setup environment' },
            { week: 2, task: 'Build project kecil dengan fitur dasar' },
            { week: 3, task: 'Implementasi fitur advanced' },
            { week: 4, task: 'Testing dan optimization' },
          ],
          daily_action: 'Belajar 1-2 jam per hari fokus pada praktik',
          projection: 'Estimasi progress +25% dalam periode ini',
          note: 'Fokus pada konsistensi dan praktik langsung'
        }
      };
    }
  },
};

export default {
  goals: goalsService,
  roadmaps: roadmapsService,
  roadmapsAI: roadmapsAIService,
  healthCheck: healthCheckService,
  ai: aiGoalsService,
};