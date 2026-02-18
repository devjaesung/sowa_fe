import { StatCard } from "./AdminCommon";
import type { DashboardStats } from "../../api/types";

interface AdminDashboardTabProps {
  statsData: DashboardStats | undefined;
  inquiryCount: number;
  pendingCount: number;
  portfolioCount: number;
}

export default function AdminDashboardTab({
  statsData,
  inquiryCount,
  pendingCount,
  portfolioCount,
}: AdminDashboardTabProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <StatCard label="전체 문의" value={statsData?.total_inquiries ?? inquiryCount} />
      <StatCard label="미답변 문의" value={statsData?.pending_inquiries ?? pendingCount} />
      <StatCard
        label="답변 완료 문의"
        value={statsData?.replied_inquiries ?? Math.max(inquiryCount - pendingCount, 0)}
      />
      <StatCard label="포트폴리오" value={statsData?.total_portfolio ?? portfolioCount} />
    </div>
  );
}
