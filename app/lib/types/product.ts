
// estoy usando este type ya que any en el record el lint me lo marca como error, (ya que no es recomendable usarlo)
type AttributeValue = string | number | boolean | null;

export interface Product {
  product_id: number;
  name: string;
  price: number;
  description: string;
  online_stock: number;
  sku: string;
  release_date: string;
  is_featured: boolean;
  is_active: boolean;
  product_type: string;
  attributes: Record<string, AttributeValue>;
  product_image: string;
  supplier_id: number | null;
  created_at: string;
  updated_at: string;
  supplier: Supplier | null;
  categories: Category[];
}

export interface Supplier {
  supplier_id: number;
  name: string;
  contact_info: string;
}

export interface Category {
  category_id: number;
  name: string;
  description: string;
}

export interface CreateProductDTO {
  name: string;
  price: number;
  description: string;
  online_stock: number;
  sku: string;
  release_date: string;
  is_featured?: boolean;
  is_active?: boolean;
  product_type?: string;
  attributes?: Record<string, AttributeValue>;
  product_image?: string;
  supplier_id?: number | null;
  category_ids?: number[];
}

export interface UpdateProductDTO {
  name?: string;
  price?: number;
  description?: string;
  online_stock?: number;
  sku?: string;
  release_date?: string;
  is_featured?: boolean;
  is_active?: boolean;
  product_type?: string;
  attributes?: Record<string, AttributeValue>;
  product_image?: string;
  supplier_id?: number | null;
  category_ids?: number[];
}

export interface ProductsResponse {
  products: Product[];
  total?: number;
  page?: number;
  items_per_page?: number;
  total_pages?: number;
}

export interface ProductFilters {
  search: string;
  category: string;
  status: 'all' | 'active' | 'inactive' | 'out_of_stock';
  is_featured: boolean | null;
  product_type: string;
  price_min: number | null;
  price_max: number | null;
}

export interface ProductModalState {
  isOpen: boolean;
  mode: 'create' | 'edit' | 'view' | 'delete';
  product?: Product;
}

export interface ProductFormErrors {
  general?: string;
  name?: string;
  price?: string;
  description?: string;
  online_stock?: string;
  sku?: string;
  release_date?: string;
  product_image?: string;
  supplier_id?: string;
  [key: string]: string | undefined;
}