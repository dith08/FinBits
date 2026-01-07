export interface DashboardData {
    productivity: {
      score: number;
      trend: string;
      graphData: any[];
    };
    finance: {
      score: number;
      pemasukan: number;
      pengeluaran: number;
      tabungan: number;
      graphData: {
        income: Array<{ date: string; amount: number }>;
        expense: any[];
      };
    };
    habit: {
      consistency: number;
      graphData: Array<{ date: string; completionRate: number | null }>;
    };
    goals: {
      totalGoalsMessage: string;
      averageProgress: number;
      activeGoals: Array<{
        name: string;
        progress: number;
        dueDate: string | null;
        status: string;
      }>;
      graphData: Array<{ date: string; avgProgress: number }>;
    };
    multiLineChart: Array<{
      date: string;
      productivity: number | null;
      financeBalance: number | null;
      goalsProgress: number;
      habitCompletion: number | null;
    }>;
  }
  
  export interface DashboardResponse {
    message: string;
    data: DashboardData;
  }