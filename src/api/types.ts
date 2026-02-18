export type Age = "20" | "30" | "40" | "";
export type InteriorType = "residential" | "commercial" | "";

export interface MessageResponse {
  detail: string;
}

export interface Category {
  id: number;
  name: string;
  order?: number;
}

export interface CategoryRequest {
  name: string;
  order?: number;
}

export interface Comment {
  id: number;
  content: string;
  created_at: string;
}

export interface InquiryListItem {
  id: number;
  name: string;
  phone: string;
  created_at: string;
  has_reply: boolean;
}

export interface InquiryDetail {
  id: number;
  name: string;
  phone: string;
  age?: Age;
  interior_type?: InteriorType;
  area?: string;
  move_in_date?: string;
  work_request?: string;
  content?: string;
  created_at: string;
  comments: Comment[];
}

export interface InquiryCreateRequest {
  name: string;
  phone: string;
  password: string;
  age?: Age;
  interior_type?: InteriorType;
  area?: string;
  move_in_date?: string;
  work_request?: string;
  content?: string;
}

export interface InquiryPasswordRequest {
  password: string;
}

export interface PortfolioImage {
  id: number;
  category: Category;
  title: string;
  image: string;
  description?: string;
  is_featured?: boolean;
  order?: number;
  created_at: string;
}

export interface PortfolioImageRequest {
  category_id?: number | null;
  title: string;
  image?: File;
  description?: string;
  is_featured?: boolean;
  order?: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface DashboardStats {
  total_inquiries: number;
  pending_inquiries: number;
  replied_inquiries: number;
  total_portfolio: number;
}

export interface SiteSettings {
  id: number;
  logo_image: string | null;
  site_title: string;
  hero_image: string | null;
  hero_title: string;
  hero_subtitle: string;
  updated_at: string;
}

export interface SiteSettingsRequest {
  logo_image?: File | null;
  site_title?: string;
  hero_image?: File | null;
  hero_title?: string;
  hero_subtitle?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}
