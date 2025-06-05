 //app/lib/types/auth.ts
 
 export interface LoginFormData {
    email: string;
    password: string;
  }
  
  export interface RegisterFormData {
    email: string;
    username: string;
    password: string;
  
  }
  
  export interface LoginResponse {
    user?: string;
    access_token?: string;
    error?: string;
  }
  
  export interface AuthResponse {
    message?: string;
    error?: string;
  }
  
