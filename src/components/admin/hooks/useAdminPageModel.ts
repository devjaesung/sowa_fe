import { useMemo, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sowaApi } from "../../../api/sowaApi";
import type {
  Category,
  DashboardStats,
  InquiryDetail,
  InquiryListItem,
  PortfolioImage,
  SiteSettings,
} from "../../../api/types";
import type {
  CategoryEditorMode,
  CategoryFormState,
  NoticeState,
  PortfolioEditorMode,
  PortfolioFormState,
  SettingsFormState,
  TabKey,
} from "../types";
import { parseErrorMessage } from "../../../shared/error";

const toList = <T,>(value: unknown): T[] => {
  if (Array.isArray(value)) {
    return value as T[];
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "results" in value &&
    Array.isArray((value as { results?: unknown }).results)
  ) {
    return (value as { results: T[] }).results;
  }

  return [];
};

const isStats = (value: unknown): value is DashboardStats => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const target = value as Record<string, unknown>;
  return (
    typeof target.total_inquiries === "number" &&
    typeof target.pending_inquiries === "number" &&
    typeof target.replied_inquiries === "number" &&
    typeof target.total_portfolio === "number"
  );
};

const createEmptyPortfolioForm = (): PortfolioFormState => ({
  id: "",
  category_id: "",
  title: "",
  description: "",
  is_featured: false,
  order: "0",
  image: null,
});

const createEmptySettingsForm = (): SettingsFormState => ({
  site_title: undefined,
  hero_title: undefined,
  hero_subtitle: undefined,
  logo_image: null,
  hero_image: null,
});

const sortByOrder = <T extends { order?: number }>(list: T[]) =>
  [...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

export function useAdminPageModel() {
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");
  const [notice, setNotice] = useState<NoticeState | null>(null);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [categoryEditorMode, setCategoryEditorMode] = useState<CategoryEditorMode>(null);
  const [categoryEditId, setCategoryEditId] = useState<number | null>(null);
  const [categoryForm, setCategoryForm] = useState<CategoryFormState>({ name: "", order: "0" });
  const [portfolioEditorMode, setPortfolioEditorMode] = useState<PortfolioEditorMode>(null);
  const [portfolioForm, setPortfolioForm] = useState<PortfolioFormState>(createEmptyPortfolioForm);
  const [selectedAdminInquiryId, setSelectedAdminInquiryId] = useState("");
  const [commentText, setCommentText] = useState("");
  const [settingsForm, setSettingsForm] = useState<SettingsFormState>(createEmptySettingsForm);

  const sessionCheckQuery = useQuery({
    queryKey: ["admin-session-check"],
    queryFn: sowaApi.admin.getStats,
    retry: false,
  });

  const isAuthenticated = sessionCheckQuery.isSuccess;

  const statsQuery = useQuery({
    queryKey: ["admin-stats"],
    queryFn: sowaApi.admin.getStats,
    enabled: isAuthenticated,
  });

  const categoryQuery = useQuery({
    queryKey: ["admin-categories"],
    queryFn: sowaApi.admin.listCategories,
    enabled: isAuthenticated,
  });

  const portfolioQuery = useQuery({
    queryKey: ["admin-portfolio"],
    queryFn: sowaApi.admin.listPortfolio,
    enabled: isAuthenticated,
  });

  const adminInquiryQuery = useQuery({
    queryKey: ["admin-inquiry"],
    queryFn: sowaApi.admin.listInquiry,
    enabled: isAuthenticated,
  });

  const adminInquiryDetailQuery = useQuery({
    queryKey: ["admin-inquiry-detail", selectedAdminInquiryId],
    queryFn: () => sowaApi.admin.getInquiry(Number(selectedAdminInquiryId)),
    enabled: isAuthenticated && selectedAdminInquiryId.trim().length > 0,
  });

  const settingsQuery = useQuery<SiteSettings>({
    queryKey: ["admin-settings"],
    queryFn: sowaApi.admin.getSettings,
    enabled: isAuthenticated,
  });

  const showError = (error: unknown) => {
    setNotice({ tone: "error", message: parseErrorMessage(error) });
  };

  const showSuccess = (message: string) => {
    setNotice({ tone: "success", message });
  };

  const loginMutation = useMutation({
    mutationFn: sowaApi.admin.login,
    onSuccess: (data) => {
      showSuccess(data.detail || "로그인 성공");
      queryClient.invalidateQueries({ queryKey: ["admin-session-check"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      queryClient.invalidateQueries({ queryKey: ["admin-portfolio"] });
      queryClient.invalidateQueries({ queryKey: ["admin-inquiry"] });
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
    },
    onError: showError,
  });

  const logoutMutation = useMutation({
    mutationFn: sowaApi.admin.logout,
    onSuccess: (data) => {
      showSuccess(data.detail || "로그아웃 성공");
      queryClient.removeQueries({ queryKey: ["admin-session-check"] });
      queryClient.removeQueries({ queryKey: ["admin-stats"] });
      queryClient.removeQueries({ queryKey: ["admin-categories"] });
      queryClient.removeQueries({ queryKey: ["admin-portfolio"] });
      queryClient.removeQueries({ queryKey: ["admin-inquiry"] });
      queryClient.removeQueries({ queryKey: ["admin-settings"] });
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["admin-session-check"] });
      }, 0);
    },
    onError: showError,
  });

  const createCategoryMutation = useMutation({
    mutationFn: sowaApi.admin.createCategory,
    onSuccess: () => {
      showSuccess("카테고리 생성 완료");
      setCategoryEditorMode(null);
      setCategoryEditId(null);
      setCategoryForm({ name: "", order: "0" });
      categoryQuery.refetch();
    },
    onError: showError,
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, name, order }: { id: number; name: string; order?: number }) =>
      sowaApi.admin.updateCategory(id, { name, order }),
    onSuccess: () => {
      showSuccess("카테고리 수정 완료");
      setCategoryEditorMode(null);
      setCategoryEditId(null);
      setCategoryForm({ name: "", order: "0" });
      categoryQuery.refetch();
    },
    onError: showError,
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: sowaApi.admin.deleteCategory,
    onSuccess: () => {
      showSuccess("카테고리 삭제 완료");
      categoryQuery.refetch();
    },
    onError: showError,
  });

  const reorderCategoryMutation = useMutation({
    mutationFn: async (nextList: Category[]) => {
      await Promise.all(
        nextList.map((item, index) =>
          sowaApi.admin.updateCategory(item.id, {
            name: item.name,
            order: index,
          }),
        ),
      );
    },
    onSuccess: () => {
      showSuccess("카테고리 순서가 변경되었습니다.");
      categoryQuery.refetch();
    },
    onError: showError,
  });

  const createPortfolioMutation = useMutation({
    mutationFn: sowaApi.admin.createPortfolio,
    onSuccess: () => {
      showSuccess("포트폴리오 생성 완료");
      setPortfolioEditorMode(null);
      setPortfolioForm(createEmptyPortfolioForm());
      portfolioQuery.refetch();
      statsQuery.refetch();
    },
    onError: showError,
  });

  const updatePortfolioMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Parameters<typeof sowaApi.admin.updatePortfolio>[1] }) =>
      sowaApi.admin.updatePortfolio(id, payload),
    onSuccess: () => {
      showSuccess("포트폴리오 수정 완료");
      setPortfolioEditorMode(null);
      setPortfolioForm(createEmptyPortfolioForm());
      portfolioQuery.refetch();
    },
    onError: showError,
  });

  const deletePortfolioMutation = useMutation({
    mutationFn: sowaApi.admin.deletePortfolio,
    onSuccess: () => {
      showSuccess("포트폴리오 삭제 완료");
      portfolioQuery.refetch();
      statsQuery.refetch();
    },
    onError: showError,
  });

  const reorderPortfolioMutation = useMutation({
    mutationFn: async (nextList: PortfolioImage[]) => {
      await Promise.all(
        nextList.map((item, index) =>
          sowaApi.admin.updatePortfolio(item.id, {
            category_id: item.category?.id ?? null,
            title: item.title,
            description: item.description,
            is_featured: item.is_featured,
            order: index,
          }),
        ),
      );
    },
    onSuccess: () => {
      showSuccess("포트폴리오 순서가 변경되었습니다.");
      portfolioQuery.refetch();
    },
    onError: showError,
  });

  const deleteInquiryMutation = useMutation({
    mutationFn: sowaApi.admin.deleteInquiry,
    onSuccess: () => {
      showSuccess("문의 삭제 완료");
      adminInquiryQuery.refetch();
      statsQuery.refetch();
      setSelectedAdminInquiryId("");
    },
    onError: showError,
  });

  const addCommentMutation = useMutation({
    mutationFn: ({ inquiryId, content }: { inquiryId: number; content: string }) =>
      sowaApi.admin.createComment(inquiryId, content),
    onSuccess: () => {
      showSuccess("답변 등록 완료");
      setCommentText("");
      adminInquiryDetailQuery.refetch();
      adminInquiryQuery.refetch();
      statsQuery.refetch();
    },
    onError: showError,
  });

  const deleteCommentMutation = useMutation({
    mutationFn: sowaApi.admin.deleteComment,
    onSuccess: () => {
      showSuccess("답변 삭제 완료");
      adminInquiryDetailQuery.refetch();
      adminInquiryQuery.refetch();
      statsQuery.refetch();
    },
    onError: showError,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: sowaApi.admin.updateSettings,
    onSuccess: () => {
      showSuccess("사이트 설정 수정 완료");
      setSettingsForm(createEmptySettingsForm());
      settingsQuery.refetch();
    },
    onError: showError,
  });

  const categoryList = toList<Category>(categoryQuery.data);
  const portfolioList = toList<PortfolioImage>(portfolioQuery.data);
  const inquiryList = toList<InquiryListItem>(adminInquiryQuery.data);

  const orderedCategoryList = useMemo(() => sortByOrder(categoryList), [categoryList]);
  const orderedPortfolioList = useMemo(() => sortByOrder(portfolioList), [portfolioList]);

  const statsData = isStats(statsQuery.data) ? statsQuery.data : undefined;
  const inquiryDetail =
    typeof adminInquiryDetailQuery.data === "object" && adminInquiryDetailQuery.data !== null
      ? (adminInquiryDetailQuery.data as InquiryDetail)
      : undefined;

  const pendingCount = useMemo(
    () => inquiryList.filter((item) => !item.has_reply).length,
    [inquiryList],
  );

  const submitLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!loginForm.username || !loginForm.password) {
      setNotice({ tone: "error", message: "관리자 로그인은 username/password 모두 필수입니다." });
      return;
    }

    loginMutation.mutate(loginForm);
  };

  const submitCategory = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!categoryForm.name.trim()) {
      setNotice({ tone: "error", message: "카테고리 name은 필수입니다." });
      return;
    }

    const orderValue = Number(categoryForm.order || "0");

    if (categoryEditorMode === "edit") {
      if (!categoryEditId) {
        setNotice({ tone: "error", message: "수정할 카테고리를 선택해주세요." });
        return;
      }

      updateCategoryMutation.mutate({
        id: categoryEditId,
        name: categoryForm.name.trim(),
        order: orderValue,
      });
      return;
    }

    createCategoryMutation.mutate({ name: categoryForm.name.trim(), order: orderValue });
  };

  const submitPortfolioCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!portfolioForm.title || !portfolioForm.image) {
      setNotice({ tone: "error", message: "포트폴리오 생성은 title/image가 필수입니다." });
      return;
    }

    createPortfolioMutation.mutate({
      category_id: portfolioForm.category_id ? Number(portfolioForm.category_id) : null,
      title: portfolioForm.title,
      image: portfolioForm.image,
      description: portfolioForm.description,
      is_featured: portfolioForm.is_featured,
      order: Number(portfolioForm.order || "0"),
    });
  };

  const submitPortfolioUpdate = () => {
    if (!portfolioForm.id) {
      setNotice({ tone: "error", message: "수정할 포트폴리오 ID를 입력해주세요." });
      return;
    }

    updatePortfolioMutation.mutate({
      id: Number(portfolioForm.id),
      payload: {
        category_id: portfolioForm.category_id ? Number(portfolioForm.category_id) : null,
        title: portfolioForm.title,
        image: portfolioForm.image ?? undefined,
        description: portfolioForm.description,
        is_featured: portfolioForm.is_featured,
        order: Number(portfolioForm.order || "0"),
      },
    });
  };

  const submitSettings = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    updateSettingsMutation.mutate({
      site_title: settingsForm.site_title ?? settingsQuery.data?.site_title ?? "",
      hero_title: settingsForm.hero_title ?? settingsQuery.data?.hero_title ?? "",
      hero_subtitle: settingsForm.hero_subtitle ?? settingsQuery.data?.hero_subtitle ?? "",
      logo_image: settingsForm.logo_image,
      hero_image: settingsForm.hero_image,
    });
  };

  return {
    activeTab,
    setActiveTab,
    notice,
    setNotice,
    loginForm,
    setLoginForm,
    categoryEditorMode,
    setCategoryEditorMode,
    categoryEditId,
    setCategoryEditId,
    categoryForm,
    setCategoryForm,
    portfolioEditorMode,
    setPortfolioEditorMode,
    portfolioForm,
    setPortfolioForm,
    selectedAdminInquiryId,
    setSelectedAdminInquiryId,
    commentText,
    setCommentText,
    settingsForm,
    setSettingsForm,
    isAuthenticated,
    sessionCheckQuery,
    loginMutation,
    logoutMutation,
    statsQuery,
    categoryQuery,
    portfolioQuery,
    adminInquiryQuery,
    adminInquiryDetailQuery,
    settingsQuery,
    statsData,
    inquiryDetail,
    pendingCount,
    categoryList,
    portfolioList,
    inquiryList,
    orderedCategoryList,
    orderedPortfolioList,
    submitLogin,
    submitCategory,
    submitPortfolioCreate,
    submitPortfolioUpdate,
    submitSettings,
    createCategoryMutation,
    deleteCategoryMutation,
    reorderCategoryMutation,
    deletePortfolioMutation,
    reorderPortfolioMutation,
    deleteInquiryMutation,
    addCommentMutation,
    deleteCommentMutation,
    createEmptyPortfolioForm,
    createEmptySettingsForm,
  };
}
