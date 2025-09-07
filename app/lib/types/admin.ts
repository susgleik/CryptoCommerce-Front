export interface AdminUser {
    id: number;
    username: string,
    email: string,
    user_type: 'admin' | 'store_staff'
    is_active: boolean,
    last_login: string
}

export interface AdminLoginResponse {
    access_token: string;
    user: AdminUser;
    permissions: string[];
    message: string;
}

export interface AdminAuthState {
    user: AdminUser | null;
    permissions: string[];
    isAuthenticated: boolean;
    loading: boolean;
}