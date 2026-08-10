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

  return (
    <div className="min-h-screen bg-surface-muted">
      <section className="mx-auto w-full max-w-310 px-5 py-8 sm:px-6 md:py-16">
        <Link
          to="/works"
          className="mb-8 inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-text-main md:mb-12"
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
          <div className="flex flex-col gap-8 md:flex-row md:gap-12">
            <div className="w-full space-y-4 md:w-56 md:shrink-0">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-20 w-full" />
            </div>
            <div className="flex-1 space-y-4">
              {Array.from({ length: 3 }, (_, i) => (
                <Skeleton key={i} className="h-56 w-full rounded-lg md:h-80" />
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
          <div className="flex flex-col gap-8 md:flex-row md:gap-16">
            {/* 왼쪽: 개요 */}
            <aside className="md:w-56 md:shrink-0">
              <div className="md:sticky md:top-24">
                <h1 className="text-xl font-medium tracking-[-0.01em] text-text-main md:text-2xl">
                  {work.title}
                </h1>
                <p className="mt-2 text-sm text-text-muted">
                  {work.category?.name ?? "미분류"}
                </p>
                {work.year || work.location || work.area ? (
                  <dl className="mt-6 space-y-3 border-t border-line pt-5 text-sm">
                    {work.year ? (
                      <div>
                        <dt className="text-xs font-semibold tracking-[0.08em] text-text-subtle">
                          YEAR
                        </dt>
                        <dd className="mt-1 text-text-main">{work.year}</dd>
                      </div>
                    ) : null}
                    {work.location ? (
                      <div>
                        <dt className="text-xs font-semibold tracking-[0.08em] text-text-subtle">
                          LOCATION
                        </dt>
                        <dd className="mt-1 break-words text-text-main">{work.location}</dd>
                      </div>
                    ) : null}
                    {work.area ? (
                      <div>
                        <dt className="text-xs font-semibold tracking-[0.08em] text-text-subtle">
                          AREA
                        </dt>
                        <dd className="mt-1 text-text-main">{work.area}</dd>
                      </div>
                    ) : null}
                  </dl>
                ) : null}
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
                      className="w-full rounded-lg object-cover"
                    />
                  ))
                : work.thumbnail && (
                    <img
                      src={resolveAssetUrl(work.thumbnail)}
                      alt={work.title}
                      className="w-full rounded-lg object-cover"
                    />
                  )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
