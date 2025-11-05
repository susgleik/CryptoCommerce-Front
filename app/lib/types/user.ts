// User types based on API documentation

export interface User {
  id: number;
  username: string;
  email: string;
  user_type: 'common' | 'admin' | 'store_staff';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login: string | null;
}

export interface UsersResponse {
  items: User[];
  total: number;
  page: number;
  items_per_page: number;
  total_pages: number;
  current_user: {
    username: string;
    user_type: string;
  };
}

export interface UserFilters {
  search: string;
  user_type: 'all' | 'common' | 'admin' | 'store_staff';
  is_active: 'all' | 'active' | 'inactive';
}

export interface UserModalState {
  isOpen: boolean;
  mode: 'view' | 'delete';
  user?: User;
}
