export interface NotificationItem {
    id: number;
    user_id: number;
    title: string;
    time: string;
    is_read: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface NotificationResponse {
    success: boolean;
    message: string;
    data: NotificationItem[];
  }