import { cn } from "./cn";

interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("animate-pulse rounded-md bg-panel", className)} aria-hidden />;
}
