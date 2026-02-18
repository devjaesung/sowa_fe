import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { sowaApi } from "../api/sowaApi";
import ProjectCard, { ProjectCardSkeleton } from "../components/common/ProjectCard";
import Button from "../components/ui/Button";

export default function PortfolioPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const categoriesQuery = useQuery({
    queryKey: ["public-portfolio-categories"],
    queryFn: sowaApi.public.getCategories,
  });

  const portfolioQuery = useQuery({
    queryKey: ["public-portfolio-images", selectedCategoryId],
    queryFn: () =>
      sowaApi.public.getPortfolioImages(
        selectedCategoryId ? { category: selectedCategoryId } : undefined,
      ),
  });

  const categoryTabs = useMemo(
    () => [
      { id: null as number | null, label: "전체" },
      ...(categoriesQuery.data ?? []).map((category) => ({
        id: category.id,
        label: category.name,
      })),
    ],
    [categoriesQuery.data],
  );

  const portfolioItems = portfolioQuery.data?.results ?? [];

  return (
    <div className="bg-surface-muted">
      <section className="border-y border-line px-6 py-8 text-center md:py-10">
        <h1 className="text-2xl font-medium tracking-[-0.01em] text-text-main md:text-4xl">
          포트폴리오
        </h1>
      </section>

      <section className="mx-auto w-full max-w-310 px-6 py-14 md:py-16">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-text-muted">
            총 {portfolioItems.length}개의 프로젝트
          </p>
          <div className="flex flex-wrap gap-2">
            {categoryTabs.map((category) => (
              <Button
                key={category.id ?? "all"}
                type="button"
                onClick={() => setSelectedCategoryId(category.id)}
                shape="pill"
                variant={selectedCategoryId === category.id ? "brand" : "outline"}
                className="h-10 px-5"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {portfolioQuery.isLoading ? (
            Array.from({ length: 6 }, (_, index) => <ProjectCardSkeleton key={`portfolio-skeleton-${index}`} />)
          ) : null}
          {portfolioQuery.isError ? (
            <p className="text-sm text-red-600">프로젝트를 불러오지 못했습니다.</p>
          ) : null}
          {!portfolioQuery.isLoading && !portfolioQuery.isError && portfolioItems.length === 0 ? (
            <p className="text-sm text-text-muted">등록된 프로젝트가 없습니다.</p>
          ) : null}
          {portfolioItems.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              category={project.category?.name ?? "미분류"}
              year={new Date(project.created_at).getFullYear().toString()}
              image={project.image}
              summary={project.description}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
