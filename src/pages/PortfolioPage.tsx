import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { sowaApi } from "../api/sowaApi";
import ProjectCard, { ProjectCardSkeleton } from "../components/common/ProjectCard";
import Button from "../components/ui/Button";

export default function PortfolioPage() {
  const [activeParentId, setActiveParentId] = useState<number | null>(null);
  const [activeChildId, setActiveChildId] = useState<number | null>(null);

  const categoriesQuery = useQuery({
    queryKey: ["public-portfolio-categories-tree"],
    queryFn: () => sowaApi.public.getCategories({ tree: true }),
  });

  // 대분류 목록 (tree 응답의 최상위 항목들)
  const parentCategories = useMemo(
    () => categoriesQuery.data?.filter((c) => c.parent == null) ?? [],
    [categoriesQuery.data],
  );

  // 현재 선택된 대분류의 소분류 목록
  const childCategories = useMemo(() => {
    if (activeParentId === null) return [];
    const parent = parentCategories.find((c) => c.id === activeParentId);
    return parent?.children ?? [];
  }, [activeParentId, parentCategories]);

  // API에 실제로 전달할 category id
  const effectiveCategoryId = activeChildId ?? activeParentId ?? undefined;

  const worksQuery = useQuery({
    queryKey: ["public-works", activeParentId, activeChildId],
    queryFn: () =>
      sowaApi.public.getWorks(
        effectiveCategoryId ? { category: effectiveCategoryId } : undefined,
      ),
  });

  const works = worksQuery.data?.results ?? [];

  const handleParentClick = (id: number | null) => {
    setActiveParentId(id);
    setActiveChildId(null); // 대분류 바꾸면 소분류 초기화
  };

  return (
    <div className="bg-surface-muted">
      <section className="border-y border-line px-4 py-8 text-center sm:px-6 md:py-10">
        <h1 className="text-2xl font-medium tracking-[-0.01em] text-text-main md:text-4xl">
          포트폴리오
        </h1>
      </section>

      <section className="mx-auto w-full max-w-310 px-4 py-10 sm:px-6 md:py-16">
        {/* 대분류 필터 */}
        <div className="mb-3 flex flex-wrap gap-2">
          <Button
            type="button"
            shape="pill"
            variant={activeParentId === null ? "brand" : "outline"}
            className="h-10 px-5"
            onClick={() => handleParentClick(null)}
          >
            전체
          </Button>
          {parentCategories.map((cat) => (
            <Button
              key={cat.id}
              type="button"
              shape="pill"
              variant={activeParentId === cat.id ? "brand" : "outline"}
              className="h-10 px-5"
              onClick={() => handleParentClick(cat.id)}
            >
              {cat.name}
            </Button>
          ))}
        </div>

        {/* 소분류 필터 — 대분류 선택 시에만 표시 */}
        {childCategories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2 border-l-2 border-accent pl-4">
            <Button
              type="button"
              shape="pill"
              variant={activeChildId === null ? "brand" : "outline"}
              className="h-9 px-4 text-sm"
              onClick={() => setActiveChildId(null)}
            >
              전체
            </Button>
            {childCategories.map((cat) => (
              <Button
                key={cat.id}
                type="button"
                shape="pill"
                variant={activeChildId === cat.id ? "brand" : "outline"}
                className="h-9 px-4 text-sm"
                onClick={() => setActiveChildId(cat.id)}
              >
                {cat.name}
              </Button>
            ))}
          </div>
        )}

        {childCategories.length === 0 && <div className="mb-8" />}

        <p className="mb-6 text-sm text-text-muted">
          총 {works.length}개의 프로젝트
        </p>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {worksQuery.isLoading
            ? Array.from({ length: 6 }, (_, i) => (
                <ProjectCardSkeleton key={`skeleton-${i}`} />
              ))
            : null}
          {worksQuery.isError ? (
            <p className="text-sm text-red-600">프로젝트를 불러오지 못했습니다.</p>
          ) : null}
          {!worksQuery.isLoading && !worksQuery.isError && works.length === 0 ? (
            <p className="text-sm text-text-muted">등록된 프로젝트가 없습니다.</p>
          ) : null}
          {works.map((work) => (
            <ProjectCard
              key={work.id}
              title={work.title}
              category={work.category?.name ?? "미분류"}
              year={work.year ?? undefined}
              location={work.location ?? undefined}
              area={work.area ?? undefined}
              image={work.thumbnail}
              summary={work.description}
              to={`/works/${work.id}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
