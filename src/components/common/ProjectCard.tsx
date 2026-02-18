import Skeleton from "../ui/Skeleton";

interface ProjectCardProps {
  title: string;
  category: string;
  area?: string;
  year?: string;
  image: string;
  summary?: string;
}

export default function ProjectCard({ title, category, area, year, image, summary }: ProjectCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-card shadow-sm">
      <img src={image} alt={title} className="h-52 w-full object-cover" />
      <div className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold tracking-[0.08em] text-text-muted">{category}</p>
          {year ? <p className="text-xs text-text-subtle">{year}</p> : null}
        </div>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-text-main">{title}</h3>
        {summary ? <p className="mt-2 text-sm leading-relaxed text-text-muted">{summary}</p> : null}
        {area ? <p className="mt-4 text-sm text-text-muted">{area}</p> : null}
      </div>
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
