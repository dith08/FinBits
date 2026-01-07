export interface TodoRequest {
    task_name: string;
    status: 'Pending' | 'In Progress' | 'Completed';
    start_date: string;
    end_date: string;
    note: string;
    reminder: boolean;
  }
  
  export interface TodoResponse {
    message: string;
    data: {
      todo_id: number;
      user_id: number;
      task_name: string;
      status: string;
      start_date: string;
      end_date: string;
      note: string;
      reminder: boolean;
      is_archived: boolean;
    };
  }

  export interface TodoAIRequest {
    target: string;
    description: string;
    start_date: string;
    end_date: string;
    goal_detail_id: number;
    reminder: boolean;
  }
  
  export interface TodoAIResponse {
    success: boolean;
    message: string;
    data: TodoItem[]; 
  }
  
  export interface TodoItem {
    todo_id: number;
    user_id: number;
    task_name: string;
    status: string;
    note: string;
    start_date: string;
    end_date: string;
    reminder: boolean;
    is_archived: boolean;
  }

  export interface HabitItem {
    habit_id: number;
    user_id: number;
    habit_name: string;
    frequency: string;
    category: string;
    note: string;
    reminder_time: string;
    progress_target: number;
    is_active: boolean;
    start_streak_date: string;
}
  export interface HabitRequest {
    habit_name: string;
    frequency: 'Daily' | 'Weekly' | 'Monthly';
    category: string;
    note: string;
    reminder_time: string;
    progress_target: number;
  }
  
  export interface HabitResponse {
    message: string;
    data: {
      habit_id: number;
      user_id: number;
      habit_name: string;
      frequency: string;
      category: string;
      note: string;
      reminder_time: string;
      progress_target: number;
      is_active: boolean;
      start_streak_date: string;
    };
  }

export interface TopHabit {
    habit_id: number;
    habit_name: string;
    note: string;
    monthly_completed: number;
    progress_percentage: number;
  }
  
  export interface HabitAIRequest {
    targetText: string;
    description: string;
  }
  
  export interface HabitAIResponse {
    success: boolean;
    message: string;
    data: HabitItem;
}

export interface HabitTrackRequest {
    date: string;
    is_completed: boolean;
  }
  
  export interface HabitLog {
    track_id: number;
    habit_id: number;
    date: string;
    is_completed: boolean;
  }
  
  export interface HabitStreakResponse {
    message: string;
    habit_name: string;
    current_streak: number;
    streak_start_date: string | null;
    total_active_habits: number;
    streak_message: string;
    logs: HabitLog[];
  }

