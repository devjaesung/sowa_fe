import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
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

  // useEffect로 state를 동기 수정하는 대신, 렌더 시점에 페이지를 클램핑
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const pagedInquiries = inquiries.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  return {
    inquiryListQuery,
    inquiries,
    pagedInquiries,
    currentPage: safePage,
    setCurrentPage,
    totalPages,
    resetToFirstPage: () => setCurrentPage(1),
  };
};

