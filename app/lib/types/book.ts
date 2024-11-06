export interface Book {
  book_id: number;
  title: string;
  author_name: string;
  isbn: string;
  price: number;
  publication_date: string;
  description: string;
  stock: number;
  categories: Category[];
}

export interface Category {
  category_id: number;
  name: string;
  description: string;
}

export interface CreateBookDTO {
  title: string;
  author_name: string;
  isbn: string;
  price: number;
  publication_date: string;
  description: string;
  stock: number;
  category_ids: number[];
}

export interface BooksResponse {
  items: Book[];
  total: number;
  page: number;
  items_per_page: number;
  total_pages: number;
}