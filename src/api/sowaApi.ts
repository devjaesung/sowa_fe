import { apiClient, toFormData } from "./client";
import type {
  Category,
  CategoryRequest,
  Comment,
  CompanyHistory,
  CompanyHistoryRequest,
  DashboardStats,
  InquiryCreateRequest,
  InquiryDetail,
  InquiryListItem,
  LoginRequest,
  MessageResponse,
  PaginatedResponse,
  Portfolio,
  PortfolioCreateRequest,
  PortfolioImage,
  PortfolioImageRequest,
  PortfolioImagesAddRequest,
  PortfolioUpdateRequest,
  SiteSettings,
  SiteSettingsRequest,
  TeamMember,
  TeamMemberRequest,
} from "./types";

// ─── Query param types ───────────────────────────────────────────────────────

interface CategoryListParams {
  tree?: boolean;
  parent?: number | "null";
}

interface WorksListParams {
  category?: number;
  is_featured?: "true" | "false";
  page?: number;
}

// ─── Public API ──────────────────────────────────────────────────────────────

const publicApi = {
  getSettings: async () => {
    const { data } = await apiClient.get<SiteSettings>("/api/settings/");
    return data;
  },

  getCategories: async (params?: CategoryListParams) => {
    const { data } = await apiClient.get<Category[]>(
      "/api/portfolio/categories/",
      { params },
    );
    return data;
  },

  getCategory: async (id: number) => {
    const { data } = await apiClient.get<Category>(
      `/api/portfolio/categories/${id}/`,
    );
    return data;
  },

  // 포트폴리오 작품 목록 (이미지 N장 포함)
  getWorks: async (params?: WorksListParams) => {
    const { data } = await apiClient.get<PaginatedResponse<Portfolio>>(
      "/api/portfolio/works/",
      { params },
    );
    return data;
  },

  getWork: async (id: number) => {
    const { data } = await apiClient.get<Portfolio>(
      `/api/portfolio/works/${id}/`,
    );
    return data;
  },

  // Story
  getHistory: async () => {
    const { data } = await apiClient.get<CompanyHistory[]>(
      "/api/story/history/",
    );
    return data;
  },

  getMembers: async () => {
    const { data } = await apiClient.get<TeamMember[]>("/api/story/members/");
    return data;
  },

  // Inquiry
  createInquiry: async (payload: InquiryCreateRequest) => {
    const { data } = await apiClient.post<InquiryDetail>(
      "/api/inquiry/create/",
      payload,
    );
    return data;
  },

};

// ─── Admin API ───────────────────────────────────────────────────────────────

const adminApi = {
  // Auth
  getStats: async () => {
    const { data } = await apiClient.get<DashboardStats>(
      "/api/dashboard-sowa/stats/",
    );
    return data;
  },

  login: async (payload: LoginRequest) => {
    const { data } = await apiClient.post<MessageResponse>(
      "/api/dashboard-sowa/login/",
      payload,
    );
    return data;
  },

  logout: async () => {
    const { data } = await apiClient.post<MessageResponse>(
      "/api/dashboard-sowa/logout/",
    );
    return data;
  },

  // Categories
  listCategories: async () => {
    const { data } = await apiClient.get<Category[]>(
      "/api/dashboard-sowa/category/",
    );
    return data;
  },

  createCategory: async (payload: CategoryRequest) => {
    const { data } = await apiClient.post<Category>(
      "/api/dashboard-sowa/category/",
      payload,
    );
    return data;
  },

  updateCategory: async (id: number, payload: CategoryRequest) => {
    const { data } = await apiClient.put<Category>(
      `/api/dashboard-sowa/category/${id}/`,
      payload,
    );
    return data;
  },

  deleteCategory: async (id: number) => {
    await apiClient.delete(`/api/dashboard-sowa/category/${id}/`);
  },

  // Portfolio (작품)
  listPortfolio: async () => {
    const { data } = await apiClient.get<Portfolio[]>(
      "/api/dashboard-sowa/portfolio/",
    );
    return data;
  },

  getPortfolio: async (id: number) => {
    const { data } = await apiClient.get<Portfolio>(
      `/api/dashboard-sowa/portfolio/${id}/`,
    );
    return data;
  },

  createPortfolio: async (payload: PortfolioCreateRequest) => {
    const body = toFormData(payload);
    const { data } = await apiClient.post<Portfolio>(
      "/api/dashboard-sowa/portfolio/",
      body,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return data;
  },

  updatePortfolio: async (id: number, payload: PortfolioUpdateRequest) => {
    const body = toFormData(payload);
    const { data } = await apiClient.put<Portfolio>(
      `/api/dashboard-sowa/portfolio/${id}/`,
      body,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return data;
  },

  deletePortfolio: async (id: number) => {
    await apiClient.delete(`/api/dashboard-sowa/portfolio/${id}/`);
  },

  // Portfolio images
  addPortfolioImages: async (
    portfolioId: number,
    payload: PortfolioImagesAddRequest,
  ) => {
    const body = toFormData(payload);
    const { data } = await apiClient.post<PortfolioImage[]>(
      `/api/dashboard-sowa/portfolio/${portfolioId}/images/`,
      body,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return data;
  },

  updatePortfolioImage: async (imageId: number, payload: PortfolioImageRequest) => {
    const { data } = await apiClient.put<PortfolioImage>(
      `/api/dashboard-sowa/portfolio-image/${imageId}/`,
      payload,
    );
    return data;
  },

  deletePortfolioImage: async (imageId: number) => {
    await apiClient.delete(`/api/dashboard-sowa/portfolio-image/${imageId}/`);
  },

  // Story — History
  listHistory: async () => {
    const { data } = await apiClient.get<CompanyHistory[]>(
      "/api/dashboard-sowa/story/history/",
    );
    return data;
  },

  createHistory: async (payload: CompanyHistoryRequest) => {
    const { data } = await apiClient.post<CompanyHistory>(
      "/api/dashboard-sowa/story/history/",
      payload,
    );
    return data;
  },

  updateHistory: async (id: number, payload: CompanyHistoryRequest) => {
    const { data } = await apiClient.put<CompanyHistory>(
      `/api/dashboard-sowa/story/history/${id}/`,
      payload,
    );
    return data;
  },

  deleteHistory: async (id: number) => {
    await apiClient.delete(`/api/dashboard-sowa/story/history/${id}/`);
  },

  // Story — Team Members
  listMembers: async () => {
    const { data } = await apiClient.get<TeamMember[]>(
      "/api/dashboard-sowa/story/member/",
    );
    return data;
  },

  createMember: async (payload: TeamMemberRequest) => {
    const { data } = await apiClient.post<TeamMember>(
      "/api/dashboard-sowa/story/member/",
      payload,
    );
    return data;
  },

  updateMember: async (id: number, payload: TeamMemberRequest) => {
    const { data } = await apiClient.put<TeamMember>(
      `/api/dashboard-sowa/story/member/${id}/`,
      payload,
    );
    return data;
  },

  deleteMember: async (id: number) => {
    await apiClient.delete(`/api/dashboard-sowa/story/member/${id}/`);
  },

  // Inquiry
  listInquiry: async () => {
    const { data } = await apiClient.get<InquiryListItem[]>(
      "/api/dashboard-sowa/inquiry/",
    );
    return data;
  },

  getInquiry: async (id: number) => {
    const { data } = await apiClient.get<InquiryDetail>(
      `/api/dashboard-sowa/inquiry/${id}/`,
    );
    return data;
  },

  deleteInquiry: async (id: number) => {
    await apiClient.delete(`/api/dashboard-sowa/inquiry/${id}/`);
  },

  createComment: async (id: number, content: string) => {
    const { data } = await apiClient.post<Comment>(
      `/api/dashboard-sowa/inquiry/${id}/comment/`,
      { content },
    );
    return data;
  },

  deleteComment: async (id: number) => {
    await apiClient.delete(`/api/dashboard-sowa/comment/${id}/`);
  },

  // Settings
  getSettings: async () => {
    const { data } = await apiClient.get<SiteSettings>(
      "/api/dashboard-sowa/settings/",
    );
    return data;
  },

  updateSettings: async (payload: SiteSettingsRequest) => {
    const body = toFormData(payload);
    const { data } = await apiClient.put<SiteSettings>(
      "/api/dashboard-sowa/settings/",
      body,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return data;
  },
};

export const sowaApi = {
  public: publicApi,
  admin: adminApi,
};
