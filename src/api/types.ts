export type Age = "20" | "30" | "40" | "";
export type InteriorType = "residential" | "commercial" | "";
export type RoleEnum = "director" | "manager" | "assistant" | "staff";

export interface MessageResponse {
  detail: string;
}

// ─── Category ───────────────────────────────────────────────────────────────

export interface Category {
  id: number;
  name: string;
  order?: number;
  parent?: number | null;
  children?: Category[]; // ?tree=true 로 요청 시 포함
}

export interface CategoryRequest {
  name: string;
  order?: number;
  parent?: number | null; // null = 대분류, number = 소분류
}

// ─── Portfolio ──────────────────────────────────────────────────────────────

// 작품에 속한 이미지 한 장
export interface PortfolioImage {
  id: number;
  image: string;
  order?: number;
  created_at: string;
}

// 이미지 순서 수정용 request
export interface PortfolioImageRequest {
  image?: File;
  order?: number;
}

// 작품 (이미지 N장 포함)
export interface Portfolio {
  id: number;
  category: Category;
  title: string;
  description?: string;
  year?: string | null;
  location?: string | null;
  area?: string | null;
  is_featured?: boolean;
  order?: number;
  created_at: string;
  thumbnail: string | null; // 첫 번째 이미지 URL
  images: PortfolioImage[];
}

export interface PortfolioCreateRequest {
  title: string;
  description?: string;
  year?: string | null;
  location?: string | null;
  area?: string | null;
  category_id?: number | null;
  is_featured?: boolean;
  order?: number;
  images?: File[];
}

export interface PortfolioUpdateRequest {
  title?: string;
  description?: string;
  year?: string | null;
  location?: string | null;
  area?: string | null;
  category_id?: number | null;
  is_featured?: boolean;
  order?: number;
  images?: File[]; // 기존 이미지 유지, 새 파일은 추가됨
}

export interface PortfolioImagesAddRequest {
  images: File[];
}

// ─── Story ──────────────────────────────────────────────────────────────────

export interface CompanyHistory {
  id: number;
  year: string;
  content: string;
  order?: number;
}

export interface CompanyHistoryRequest {
  year: string;
  content: string;
  order?: number;
}

export interface TeamMember {
  id: number;
  role: RoleEnum;
  role_display: string; // 소장 / 팀장 / 대리 / 사원
  name: string;
  title?: string; // 자격 (예: 건축사)
  education?: string;
  career?: string;
  order?: number;
}

export interface TeamMemberRequest {
  role: RoleEnum;
  name: string;
  title?: string;
  education?: string;
  career?: string;
  order?: number;
}

// ─── Inquiry ────────────────────────────────────────────────────────────────

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
  desired_budget?: string | null;
  construction_start_date?: string | null;
  referral_source?: string | null;
  referral_source_other?: string | null;
  work_request?: string;
  content?: string;
  created_at: string;
  comments: Comment[];
}

export interface InquiryCreateRequest {
  name: string;
  phone: string;
  password?: string;
  age?: Age;
  interior_type?: InteriorType;
  area?: string;
  move_in_date?: string;
  desired_budget?: string;
  construction_start_date?: string;
  referral_source?: string;
  referral_source_other?: string;
  work_request?: string;
  content?: string;
}

// ─── Site Settings ──────────────────────────────────────────────────────────

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

// ─── Misc ────────────────────────────────────────────────────────────────────

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

export interface LoginRequest {
  username: string;
  password: string;
}
