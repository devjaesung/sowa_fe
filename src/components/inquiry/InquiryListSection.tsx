import type { InquiryItem } from "./types";
import type { InquiryDetail } from "../../api/types";
import Button from "../ui/Button";
import Skeleton from "../ui/Skeleton";
import StatusBadge from "../ui/StatusBadge";
import TextInput from "../ui/TextInput";

interface InquiryListSectionProps {
  inquiries: InquiryItem[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSelectDetail: (id: number) => void;
  selectedInquiryId: number | null;
  selectedDetail: InquiryDetail | null;
  isPasswordRequired: boolean;
  detailPassword: string;
  detailErrorMessage: string;
  isDetailLoading: boolean;
  onDetailPasswordChange: (value: string) => void;
  onVerifyDetail: (id: number, password: string) => void;
  onCloseDetail: () => void;
  onWrite: () => void;
  isLoading?: boolean;
  errorMessage?: string;
}

export default function InquiryListSection({
  inquiries,
  totalCount,
  currentPage,
  totalPages,
  onPageChange,
  onSelectDetail,
  selectedInquiryId,
  selectedDetail,
  isPasswordRequired,
  detailPassword,
  detailErrorMessage,
  isDetailLoading,
  onDetailPasswordChange,
  onVerifyDetail,
  onCloseDetail,
  onWrite,
  isLoading = false,
  errorMessage = "",
}: InquiryListSectionProps) {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <p className="text-sm text-text-muted">총 {totalCount}개의 문의</p>
        <Button type="button" onClick={onWrite} className="h-11 px-7">
          글쓰기
        </Button>
      </div>

      <div className="space-y-3">
        {isLoading
          ? Array.from({ length: 5 }, (_, index) => (
              <article
                key={`inquiry-skeleton-${index}`}
                className="rounded-xl border border-line bg-card px-5 py-4 shadow-sm"
                aria-hidden
              >
                <div className="flex items-center justify-between gap-3">
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-6 w-18 rounded-full" />
                </div>
                <div className="mt-3">
                  <Skeleton className="h-4 w-28" />
                </div>
              </article>
            ))
          : null}
        {!isLoading && errorMessage ? (
          <p className="rounded-xl border border-line bg-card px-5 py-4 text-sm text-red-600 shadow-sm">
            {errorMessage}
          </p>
        ) : null}
        {!isLoading && !errorMessage && inquiries.length === 0 ? (
          <p className="rounded-xl border border-line bg-card px-5 py-4 text-sm text-text-muted shadow-sm">
            등록된 문의가 없습니다.
          </p>
        ) : null}
        {inquiries.map((item) => (
          <article
            key={item.id}
            className="rounded-xl border border-line bg-card px-5 py-4 shadow-sm"
          >
            <div
              className="cursor-pointer"
              onClick={() => onSelectDetail(item.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelectDetail(item.id);
                }
              }}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-lg font-semibold text-text-main">
                  {item.title}
                </p>
                <StatusBadge tone={item.hasReply ? "success" : "warn"}>
                  {item.hasReply ? "답변완료" : "대기중"}
                </StatusBadge>
              </div>

              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-muted">
                <span>작성일 {item.createdAt}</span>
              </div>
            </div>

            {selectedInquiryId === item.id ? (
              <div
                className="mt-4 rounded-lg border border-line bg-surface-muted p-4"
                onClick={(event) => event.stopPropagation()}
              >
                {selectedDetail ? (
                  <div className="space-y-2 text-sm text-text-main">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">문의 상세</p>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-8 px-3 text-xs"
                        onClick={onCloseDetail}
                      >
                        닫기
                      </Button>
                    </div>
                    <div className="rounded-md border border-line bg-card px-3 py-2">
                      <div>이름: {selectedDetail.name}</div>
                      <div>연락처: {selectedDetail.phone}</div>
                      <div>연령대: {selectedDetail.age || "-"}</div>
                      <div>
                        인테리어 종류:{" "}
                        {selectedDetail.interior_type === "residential"
                          ? "주거"
                          : selectedDetail.interior_type === "commercial"
                            ? "상업"
                            : "-"}
                      </div>
                      <div>평수: {selectedDetail.area || "-"}</div>
                      <div>
                        입주 예정일: {selectedDetail.move_in_date || "-"}
                      </div>
                      <div>
                        원하는 공사: {selectedDetail.work_request || "-"}
                      </div>
                      <div>기타 요구사항: {selectedDetail.content || "-"}</div>
                    </div>
                    <div className="pt-2 font-medium">답변</div>
                    {selectedDetail.comments.length === 0 ? (
                      <p className="text-text-muted">등록된 답변이 없습니다.</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedDetail.comments.map((comment) => (
                          <article
                            key={comment.id}
                            className="rounded-md border border-line bg-card px-3 py-2"
                          >
                            <div>{comment.content}</div>
                            <div className="mt-1 text-xs text-text-muted">
                              {new Date(comment.created_at).toLocaleString(
                                "ko-KR",
                              )}
                            </div>
                          </article>
                        ))}
                      </div>
                    )}
                  </div>
                ) : isDetailLoading && !isPasswordRequired ? (
                  <p className="text-sm text-text-muted">
                    세션 인증 여부를 확인하는 중입니다.
                  </p>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-text-muted">
                      비밀번호를 입력하고 조회하세요.
                    </p>
                    <div className="flex flex-col gap-2 md:flex-row">
                      <TextInput
                        value={detailPassword}
                        onValueChange={onDetailPasswordChange}
                        placeholder="비밀번호"
                        type="password"
                        maxLength={50}
                        className="md:max-w-64"
                      />
                      <Button
                        type="button"
                        className="h-10 px-4 md:w-auto"
                        onClick={() => onVerifyDetail(item.id, detailPassword)}
                        disabled={isDetailLoading}
                      >
                        {isDetailLoading ? "조회 중..." : "상세 조회"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-10 px-4 md:w-auto"
                        onClick={onCloseDetail}
                      >
                        닫기
                      </Button>
                    </div>
                    {detailErrorMessage ? (
                      <p className="text-sm text-red-600">
                        {detailErrorMessage}
                      </p>
                    ) : null}
                  </div>
                )}
              </div>
            ) : null}
          </article>
        ))}
      </div>

      {!isLoading && !errorMessage && totalPages > 1 ? (
        <div className="mt-6 flex items-center justify-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-9 px-3 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => {
              if (currentPage === 1) {
                return;
              }
              onPageChange(currentPage - 1);
            }}
            disabled={currentPage === 1}
          >
            이전
          </Button>
          <span className="text-sm text-text-muted">
            {currentPage} / {totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            className="h-9 px-3 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => {
              if (currentPage === totalPages) {
                return;
              }
              onPageChange(currentPage + 1);
            }}
            disabled={currentPage === totalPages}
          >
            다음
          </Button>
        </div>
      ) : null}
    </div>
  );
}
