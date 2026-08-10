import { Link } from "react-router";
import Skeleton from "../ui/Skeleton";
import { resolveAssetUrl } from "../../shared/assetUrl";

interface ProjectCardProps {
  title: string;
  category: string;
  area?: string;
  year?: string;
  location?: string;
  image?: string | null;
  summary?: string;
  to?: string;
}

export default function ProjectCard({ title, category, area, year, location, image, summary, to }: ProjectCardProps) {
  const imageSrc = resolveAssetUrl(image);

  const inner = (
    <>
      {imageSrc ? (
        <img src={imageSrc} alt={title} className="h-52 w-full object-cover transition-transform duration-300 group-hover:scale-105" />
      ) : (
        <div className="flex h-52 w-full items-center justify-center bg-panel text-sm text-text-subtle">
          이미지 없음
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold tracking-[0.08em] text-text-muted">{category}</p>
          {year ? <p className="text-xs text-text-subtle">{year}</p> : null}
        </div>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-text-main">{title}</h3>
        {summary ? <p className="mt-2 text-sm leading-relaxed text-text-muted">{summary}</p> : null}
        {location || area ? (
          <p className="mt-4 text-sm text-text-muted">
            {[location, area].filter(Boolean).join(" · ")}
          </p>
        ) : null}
      </div>
    </>
  );

  if (to) {
    return (
      <Link to={to} className="group block overflow-hidden rounded-2xl border border-line bg-card shadow-sm transition-shadow hover:shadow-md">
        {inner}
      </Link>
    );
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-card shadow-sm">
      {inner}
    </article>
  );
}

export function ProjectCardSkeleton() {
  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-card shadow-sm">
      <Skeleton className="h-52 w-full rounded-none" />
      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-7 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </article>
  );
}
