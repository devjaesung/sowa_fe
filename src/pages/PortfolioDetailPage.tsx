import { Link, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { sowaApi } from "../api/sowaApi";
import { resolveAssetUrl } from "../shared/assetUrl";
import Skeleton from "../components/ui/Skeleton";

export default function PortfolioDetailPage() {
  const { id } = useParams<{ id: string }>();
  const portfolioId = Number(id);

  const query = useQuery({
    queryKey: ["public-work", portfolioId],
    queryFn: () => sowaApi.public.getWork(portfolioId),
    enabled: !Number.isNaN(portfolioId),
  });

  const work = query.data;
  const year = work ? new Date(work.created_at).getFullYear().toString() : null;

  return (
    <div className="min-h-screen bg-surface-muted">
      <section className="mx-auto w-full max-w-310 px-6 py-12 md:py-16">
        <Link
          to="/works"
          className="mb-12 inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-text-main"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          목록으로
        </Link>

        {query.isLoading && (
          <div className="flex gap-12">
            <div className="w-56 shrink-0 space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-20 w-full" />
            </div>
            <div className="flex-1 space-y-4">
              {Array.from({ length: 3 }, (_, i) => (
                <Skeleton key={i} className="h-80 w-full rounded-2xl" />
              ))}
            </div>
          </div>
        )}

        {query.isError && (
          <p className="text-sm text-red-600">
            프로젝트를 불러오지 못했습니다.
          </p>
        )}

        {work && (
          <div className="flex flex-col gap-10 md:flex-row md:gap-16">
            {/* 왼쪽: 개요 */}
            <aside className="md:w-56 md:shrink-0">
              <div className="md:sticky md:top-24">
                <h1 className="text-xl font-medium tracking-[-0.01em] text-text-main md:text-2xl">
                  {work.title}
                </h1>
                <p className="mt-2 text-sm text-text-muted">
                  {work.category?.name ?? "미분류"}
                  {year ? ` · ${year}` : ""}
                </p>
                {work.description && (
                  <p className="mt-6 text-sm leading-relaxed text-text-muted">
                    {work.description}
                  </p>
                )}
              </div>
            </aside>

            {/* 오른쪽: 이미지 목록 */}
            <div className="flex-1 space-y-4">
              {work.images.length > 0
                ? work.images.map((img) => (
                    <img
                      key={img.id}
                      src={resolveAssetUrl(img.image)}
                      alt={work.title}
                      className="w-full rounded-2xl object-cover"
                    />
                  ))
                : work.thumbnail && (
                    <img
                      src={resolveAssetUrl(work.thumbnail)}
                      alt={work.title}
                      className="w-full rounded-2xl object-cover"
                    />
                  )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
