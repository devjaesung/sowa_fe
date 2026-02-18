import type { NoticeState } from "./types";

export const panelClass = "rounded-2xl border border-line bg-card p-6 shadow-sm";

export function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-9 rounded-full border px-4 text-sm font-medium transition ${
        active
          ? "border-brand-border bg-brand text-text-main"
          : "border-line bg-card-soft text-text-muted hover:border-line-strong hover:text-text-main"
      }`}
    >
      {children}
    </button>
  );
}

export function Notice({ tone, message }: NoticeState) {
  return (
    <div
      className={`rounded-xl border px-4 py-3 text-sm ${
        tone === "success"
          ? "border-success-text/20 bg-success-bg text-success-text"
          : "border-danger/20 bg-rose-50 text-danger"
      }`}
    >
      {message}
    </div>
  );
}

export function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <article className="rounded-xl border border-line bg-card-soft p-4">
      <p className="text-xs text-text-muted">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-text-main">{value}</p>
    </article>
  );
}
