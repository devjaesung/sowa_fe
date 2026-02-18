import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { sowaApi } from "../../../api/sowaApi";

const PAGE_SIZE = 10;

export const useInquiryList = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const inquiryListQuery = useQuery({
    queryKey: ["public-inquiry"],
    queryFn: sowaApi.public.getInquiryList,
  });

  const inquiries = useMemo(
    () =>
      (inquiryListQuery.data ?? []).map((item) => ({
        id: item.id,
        title: `${item.name}님의 문의`,
        name: item.name,
        createdAt: new Date(item.created_at).toLocaleDateString("ko-KR"),
        hasReply: item.has_reply,
      })),
    [inquiryListQuery.data],
  );

  const totalPages = Math.max(1, Math.ceil(inquiries.length / PAGE_SIZE));
  const pagedInquiries = inquiries.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return {
    inquiryListQuery,
    inquiries,
    pagedInquiries,
    currentPage,
    setCurrentPage,
    totalPages,
    resetToFirstPage: () => setCurrentPage(1),
  };
};

