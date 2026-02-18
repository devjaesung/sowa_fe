import Button from "../components/ui/Button";
import AdminCategoriesTab from "../components/admin/AdminCategoriesTab";
import { Notice, panelClass, TabButton } from "../components/admin/AdminCommon";
import AdminDashboardTab from "../components/admin/AdminDashboardTab";
import AdminInquiriesTab from "../components/admin/AdminInquiriesTab";
import AdminLoginView from "../components/admin/AdminLoginView";
import AdminPortfolioTab from "../components/admin/AdminPortfolioTab";
import AdminSettingsTab from "../components/admin/AdminSettingsTab";
import { useAdminPageModel } from "../components/admin/hooks/useAdminPageModel";
import Skeleton from "../components/ui/Skeleton";
import { useNavigate } from "react-router";

export default function AdminPage() {
  const navigate = useNavigate();
  const {
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
    deleteCategoryMutation,
    reorderCategoryMutation,
    deletePortfolioMutation,
    reorderPortfolioMutation,
    deleteInquiryMutation,
    addCommentMutation,
    deleteCommentMutation,
    createEmptyPortfolioForm,
  } = useAdminPageModel();

  if (sessionCheckQuery.isLoading) {
    return (
      <div className="min-h-screen bg-surface-muted">
        <header className="border-b border-line bg-card">
          <div className="mx-auto flex w-full max-w-360 flex-col gap-4 px-6 py-7 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-10 w-56" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-28 rounded-full" />
              <Skeleton className="h-10 w-24 rounded-full" />
            </div>
          </div>
        </header>
        <div className="mx-auto w-full max-w-360 px-6 py-8">
          <section className={panelClass}>
            <div className="mb-6 flex flex-wrap gap-2">
              {Array.from({ length: 5 }, (_, index) => (
                <Skeleton key={`admin-tab-skeleton-${index}`} className="h-10 w-22 rounded-full" />
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AdminLoginView
        loginForm={loginForm}
        notice={notice}
        isSubmitting={loginMutation.isPending}
        onSubmit={submitLogin}
        onChangeUsername={(value) => setLoginForm((prev) => ({ ...prev, username: value }))}
        onChangePassword={(value) => setLoginForm((prev) => ({ ...prev, password: value }))}
      />
    );
  }

  return (
    <div className="min-h-screen bg-surface-muted">
      <header className="border-b border-line bg-card">
        <div className="mx-auto flex w-full max-w-360 flex-col gap-4 px-6 py-7 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-text-subtle">SOWA Admin Dashboard</p>
            <h1 className="mt-2 text-3xl font-medium tracking-tight text-text-main md:text-4xl">관리자 페이지</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-10 px-4" onClick={() => navigate("/")}>
              공개 페이지로 이동
            </Button>
            <Button
              variant="ghost"
              className="h-10 px-4"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              로그아웃
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-360 flex-col gap-6 px-6 py-8">
        {notice ? <Notice tone={notice.tone} message={notice.message} /> : null}

        <section className={panelClass}>
          <div className="mb-4 flex flex-wrap gap-2">
            <TabButton active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")}>대시보드</TabButton>
            <TabButton active={activeTab === "categories"} onClick={() => setActiveTab("categories")}>카테고리</TabButton>
            <TabButton active={activeTab === "portfolio"} onClick={() => setActiveTab("portfolio")}>포트폴리오</TabButton>
            <TabButton active={activeTab === "inquiries"} onClick={() => setActiveTab("inquiries")}>문의/답변</TabButton>
            <TabButton active={activeTab === "settings"} onClick={() => setActiveTab("settings")}>사이트 설정</TabButton>
          </div>

          {activeTab === "dashboard" ? (
            <AdminDashboardTab
              statsData={statsData}
              inquiryCount={inquiryList.length}
              pendingCount={pendingCount}
              portfolioCount={portfolioList.length}
            />
          ) : null}

          {activeTab === "categories" ? (
            <AdminCategoriesTab
              categoryList={orderedCategoryList}
              categoryEditorMode={categoryEditorMode}
              categoryEditId={categoryEditId}
              categoryForm={categoryForm}
              onOpenCreate={() => {
                setCategoryEditorMode("create");
                setCategoryEditId(null);
                setCategoryForm({ name: "", order: "0" });
              }}
              onCloseEditor={() => {
                setCategoryEditorMode(null);
                setCategoryEditId(null);
                setCategoryForm({ name: "", order: "0" });
              }}
              onChangeForm={setCategoryForm}
              onSubmit={submitCategory}
              onEdit={(category) => {
                setCategoryEditorMode("edit");
                setCategoryEditId(category.id);
                setCategoryForm({ name: category.name, order: String(category.order ?? 0) });
              }}
              onDelete={(id) => deleteCategoryMutation.mutate(id)}
              onReorder={(nextList) => reorderCategoryMutation.mutate(nextList)}
            />
          ) : null}

          {activeTab === "portfolio" ? (
            <AdminPortfolioTab
              portfolioList={orderedPortfolioList}
              categoryList={categoryList}
              portfolioEditorMode={portfolioEditorMode}
              portfolioForm={portfolioForm}
              onOpenCreate={() => {
                setPortfolioEditorMode("create");
                setPortfolioForm(createEmptyPortfolioForm());
              }}
              onCloseEditor={() => {
                setPortfolioEditorMode(null);
                setPortfolioForm(createEmptyPortfolioForm());
              }}
              onChangeForm={setPortfolioForm}
              onSubmitCreate={submitPortfolioCreate}
              onSubmitUpdate={submitPortfolioUpdate}
              onEdit={(item) => {
                setPortfolioEditorMode("edit");
                setPortfolioForm({
                  id: String(item.id),
                  category_id: item.category?.id ? String(item.category.id) : "",
                  title: item.title,
                  description: item.description ?? "",
                  is_featured: Boolean(item.is_featured),
                  order: String(item.order ?? 0),
                  image: null,
                });
              }}
              onDelete={(id) => deletePortfolioMutation.mutate(id)}
              onReorder={(nextList) => reorderPortfolioMutation.mutate(nextList)}
            />
          ) : null}

          {activeTab === "inquiries" ? (
            <AdminInquiriesTab
              inquiryList={inquiryList}
              selectedAdminInquiryId={selectedAdminInquiryId}
              inquiryDetail={inquiryDetail}
              commentText={commentText}
              onChangeInquiryId={setSelectedAdminInquiryId}
              onRefetchDetail={() => adminInquiryDetailQuery.refetch()}
              onDeleteInquiry={() => {
                if (!selectedAdminInquiryId) {
                  setNotice({ tone: "error", message: "삭제할 문의 ID를 입력해주세요." });
                  return;
                }
                deleteInquiryMutation.mutate(Number(selectedAdminInquiryId));
              }}
              onSelectInquiry={(id) => {
                setSelectedAdminInquiryId(String(id));
                setActiveTab("inquiries");
              }}
              onChangeCommentText={setCommentText}
              onSubmitComment={(event) => {
                event.preventDefault();
                if (!selectedAdminInquiryId || !commentText.trim()) {
                  setNotice({ tone: "error", message: "답변 등록에는 문의 ID와 내용이 필요합니다." });
                  return;
                }
                addCommentMutation.mutate({ inquiryId: Number(selectedAdminInquiryId), content: commentText });
              }}
              onDeleteComment={(id) => deleteCommentMutation.mutate(id)}
            />
          ) : null}

          {activeTab === "settings" ? (
            <AdminSettingsTab
              settings={settingsQuery.data}
              settingsForm={settingsForm}
              onChangeForm={setSettingsForm}
              onSubmit={submitSettings}
            />
          ) : null}
        </section>
      </main>
    </div>
  );
}
