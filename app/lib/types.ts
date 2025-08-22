export interface Author {
  id: number;
  name: string;
  slug?: string;
  email: string;
  bio?: string;
  avatar_url?: string;
  avatar_alt_text?: string;
  job_title?: string;
  location?: string;
  phone?: string;
  linkedin_url?: string;
  twitter_url?: string;
  website_url?: string;
  company?: string;
  expertise?: string[]; // JSON array of skills
  career_highlights?: CareerHighlight[]; // JSON array of career positions
  education?: string;
  meta_title?: string;
  meta_description?: string;
  custom_schema?: string; // JSON custom schema
  seo_noindex?: boolean;
  seo_nofollow?: boolean;
  created_at: string;
  updated_at: string;
}

export interface CareerHighlight {
  title: string;
  company: string;
  duration: string;
  description?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  meta_title?: string;
  meta_description?: string;
  noindex: boolean;
  nofollow: boolean;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  featured_image_alt?: string;
  meta_title?: string;
  meta_description?: string;
  author_id: number;
  category_id: number;
  status: 'draft' | 'published' | 'archived';
  published_at?: string;
  created_at: string;
  updated_at: string;
  // Relations (populated when needed)
  author?: Author;
  category?: Category;
  tags?: string[];
}

export interface Image {
  id: number;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  alt_text?: string;
  url: string;
  created_at: string;
}

export interface Redirection {
  id: number;
  from_path: string;
  to_path: string;
  status_code: number;
  created_at: string;
  updated_at: string;
}

export interface CreateArticle {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  featured_image_alt?: string;
  meta_title?: string;
  meta_description?: string;
  author_id: number;
  category_id: number;
  status?: 'draft' | 'published' | 'archived';
  published_at?: string;
  tags?: string[];
}

export interface UpdateArticle extends Partial<CreateArticle> {
  id: number;
}

export interface CreateAuthor {
  name: string;
  slug?: string;
  email: string;
  bio?: string;
  avatar_url?: string;
  avatar_alt_text?: string;
  job_title?: string;
  location?: string;
  phone?: string;
  linkedin_url?: string;
  twitter_url?: string;
  website_url?: string;
  company?: string;
  expertise?: string[];
  career_highlights?: CareerHighlight[];
  education?: string;
  meta_title?: string;
  meta_description?: string;
  custom_schema?: string;
  seo_noindex?: boolean;
  seo_nofollow?: boolean;
}

export interface UpdateAuthor extends Partial<CreateAuthor> {
  id: number;
}

export interface CreateCategory {
  name: string;
  slug: string;
  description?: string;
  meta_title?: string;
  meta_description?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export interface UpdateCategory extends Partial<CreateCategory> {
  id: number;
}

export interface CreateRedirection {
  from_path: string;
  to_path: string;
  status_code?: number;
}

export interface UpdateRedirection extends Partial<CreateRedirection> {
  id: number;
}

export interface BlogListResponse {
  articles: Article[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}