export interface GoalRequest {
    goal_name: string;
    category: string;
    outcome: string;
    why: string;
    deadline: string;
    reminder: boolean;
  }
  
  export interface GoalResponse {
    message: string;
    goal_detail_id: number;
  }

  export interface RoadmapAIRequest {
    target: string;
  }
  
  export interface RoadmapStep {
    roadmap_id: number;
    goal_detail_id: string;
    step_number: number;
    step_description: string;
    is_ai_generated: boolean;
    is_completed: boolean;
  }
  
  export interface RoadmapAIResponse {
    success: boolean;
    message: string;
    data: RoadmapStep[];
  }

  export interface RoadmapImageRequest {
    image: File;
  }

  export interface SkillRequest {
    mainSkill: string;
    subSkill: string;
    currentLevel: string;
    skillGoal: string;
    weeklyCommitment: string;
  }
  
  export interface SkillResponse {
    message: string;
    data: {
      skill_id: number;
      user_id: number;
      main_skill: string;
      current_level: string;
      skill_goal: string;
      weekly_commitment: string;
      progress_percentage: number;
      createdAt: string;
      updatedAt: string;
    };
  }

  export interface SkillBoostAIRequest {
    skillId: number;
    targetLevel: string;
    duration: string;
  }
  
  export interface SkillBoostStep {
    step_number: number;
    step_description: string;
  }
  
  export interface SkillBoostAIResponse {
    success: boolean;
    message: string;
    plan_id: number;
    roadmap_preview: string;
    steps_suggested: SkillBoostStep[];
  }

  export interface HealthCheckRequest {
    metCommitment: boolean;
    notes: string;
  }
  
  export interface HealthCheckResponse {
    status: string;
    data: {
      consistency: {
        status: 'Good' | 'Normal' | 'Bad';
        message: string;
      };
      newSkill: {
        status: string;
        message: string;
      };
      finishGoal: {
        status: string;
        message: string;
      };
      skillBoost: {
        status: string;
        message: string;
      };
    };
  }

  export interface AddTargetAIRequest {
    target: string;
  }
  
  export interface AddTargetAIResponse {
    message: string;
    goal_detail_id: number;
    steps_count: number;
  }

export interface SkillBoostToGoalRequest {
    skillId: number;
  }
  
  export interface SkillBoostToGoalResponse {
    success: boolean;
    message: string;
    new_goal_id: number;
    total_steps: number;
  }