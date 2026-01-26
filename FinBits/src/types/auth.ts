export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface LoginResponse {
    message: string;
    token: string;
    user_id: number;
    refresh_token?: string;
  }
  
  export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
  }
  
  export interface RegisterResponse {
    message: string;
    user_id: number;
    email: string;
  }

  export interface GoogleLoginRequest {
    token: string;
  }