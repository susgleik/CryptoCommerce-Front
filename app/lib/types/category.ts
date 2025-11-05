// Types for Category Management

export interface Category {
  category_id: number;
  name: string;
  description: string;
  category_image: string | null;
  parent_category_id: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoryTree extends Category {
  subcategories: CategoryTree[];
}

export interface CreateCategoryDTO {
  name: string;
  description?: string;
  category_image?: string;
  parent_category_id?: number | null;
  is_active?: boolean;
}

export interface UpdateCategoryDTO {
  name?: string;
  description?: string;
  category_image?: string;
  parent_category_id?: number | null;
  is_active?: boolean;
}

export interface CategoryProductCount {
  category_id: number;
  category_name: string;
  products_count: number;
  include_inactive: boolean;
}

export interface BulkDeactivateRequest {
  category_ids: number[];
}

export interface BulkDeactivateResponse {
  message: string;
  total_requested: number;
  successfully_deactivated: number;
  failed: number;
  deactivated_categories: Array<{
    category_id: number;
    category_name: string;
  }>;
  errors: Array<{
    category_id: number;
    error: string;
  }>;
  action_performed_by: {
    user_type: string;
    email: string;
  };
}

export interface CategoryStatusResponse {
  message: string;
  category_id: number;
  category_name: string;
  is_active: boolean;
  action_performed_by?: {
    user_type: string;
    email: string;
  };
}

export interface CategoryDeleteResponse {
  message: string;
  category_id: number;
  category_name: string;
  is_active: boolean;
  affected_active_products?: number;
  note?: string;
  action_performed_by: {
    user_type: string;
    email: string;
  };
}

export interface CategoryFilters {
  search: string;
  status: 'all' | 'active' | 'inactive';
  parent_category: string;
}

export interface CategoryModalState {
  isOpen: boolean;
  mode: 'create' | 'edit' | 'view' | 'delete' | 'move';
  category?: Category;
}

export interface CategoryFormErrors {
  general?: string;
  name?: string;
  description?: string;
  category_image?: string;
  parent_category_id?: string;
  [key: string]: string | undefined;
}
