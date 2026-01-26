import apiInstance from './apiInstance';

export interface SkillData {
  id: number;
  skill_id?: number;
  main_skill: string;
  current_level: string;
  skill_progress: number;
  sub_skills: string;
  weekly_improvement: string;
  next_step: string;
}

export interface SkillResponse {
  skill_id: number;
  user_id: number;
  main_skill: string;
  current_level: string;
  skill_goal: string;
  weekly_commitment: string;
  progress_percentage: number;
  createdAt: string;
  updatedAt: string;
  SubSkills: Array<{
    sub_skill_id: number;
    skill_id: number;
    sub_skill_name: string;
    status: string;
    next_step: string | null;
  }>;
}

export const skillsService = {
  getAll: async (): Promise<SkillData[]> => {
    const response = await apiInstance.get('/goals/skills/');
    let skillsData = [];
    
    if (response.data?.data && Array.isArray(response.data.data)) {
      skillsData = response.data.data;
    } else if (Array.isArray(response.data)) {
      skillsData = response.data;
    }
    
    return skillsData.map((skill: SkillResponse) => {
      const subSkillsStr = skill.SubSkills?.map(s => s.sub_skill_name).join(', ') || '';
      
      return {
        id: skill.skill_id,
        skill_id: skill.skill_id,
        main_skill: skill.main_skill,
        current_level: skill.current_level,
        skill_progress: skill.progress_percentage || 0,
        sub_skills: subSkillsStr,
        weekly_improvement: skill.weekly_commitment,
        next_step: skill.skill_goal
      };
    });
  },

  getById: async (id: number): Promise<SkillData> => {
    const response = await apiInstance.get(`/goals/skills/${id}`);
    const skill = response.data?.data || response.data;
    
    const subSkillsStr = skill.SubSkills?.map((s: any) => s.sub_skill_name).join(', ') || '';
    
    return {
      id: skill.skill_id,
      skill_id: skill.skill_id,
      main_skill: skill.main_skill,
      current_level: skill.current_level,
      skill_progress: skill.progress_percentage || 0,
      sub_skills: subSkillsStr,
      weekly_improvement: skill.weekly_commitment,
      next_step: skill.skill_goal
    };
  },

  add: async (data: {
    main_skill: string;
    current_level: string;
    skill_progress?: number;
    sub_skills: string;
    weekly_improvement: string;
    next_step: string;
  }): Promise<SkillData> => {
    const payload = {
      mainSkill: data.main_skill,
      subSkill: data.sub_skills,
      currentLevel: data.current_level,
      skillGoal: data.next_step,
      weeklyCommitment: data.weekly_improvement
    };

    console.log('📤 Sending skill data to backend:');
    console.log('Payload:', JSON.stringify(payload, null, 2));
    
    try {
      const response = await apiInstance.post('/goals/skills/add', payload);
      console.log('✅ Skill added successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error adding skill:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        errors: error.response?.data?.errors,
        fullResponse: error.response?.data
      });
      throw error;
    }
  },

  edit: async (id: number, data: Partial<SkillData>): Promise<SkillData> => {
    const payload = {
      mainSkill: data.main_skill,
      currentLevel: data.current_level,
      skillProgress: data.skill_progress,
      subSkill: data.sub_skills,
      weeklyCommitment: data.weekly_improvement,
      skillGoal: data.next_step
    };
    
    console.log('📤 Updating skill:', id, 'with payload:', payload);
    
    try {
      const response = await apiInstance.put(`/goals/skills/edit/${id}`, payload);
      console.log('✅ Skill updated successfully:', response.data);
      
      return {
        id: response.data?.id || id,
        skill_id: response.data?.id || id,
        main_skill: response.data?.mainSkill || data.main_skill || '',
        current_level: response.data?.currentLevel || data.current_level || '',
        skill_progress: response.data?.skillProgress || data.skill_progress || 0,
        sub_skills: response.data?.subSkill || data.sub_skills || '',
        weekly_improvement: response.data?.weeklyCommitment || data.weekly_improvement || '',
        next_step: response.data?.skillGoal || data.next_step || ''
      };
    } catch (error: any) {
      console.error('❌ Error updating skill:', error.response?.data?.message || error.message);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    console.log('🗑️ Deleting skill:', id);
    try {
      await apiInstance.delete(`/goals/skills/delete/${id}`);
      console.log('✅ Skill deleted successfully');
    } catch (error: any) {
      console.error('❌ Error deleting skill:', error.response?.data?.message || error.message);
      throw error;
    }
  },
};

export default skillsService;
