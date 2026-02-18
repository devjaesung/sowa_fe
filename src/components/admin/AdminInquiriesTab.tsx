import type { FormEvent } from "react";
import type { InquiryDetail, InquiryListItem } from "../../api/types";
import Button from "../ui/Button";
import Chip from "../ui/Chip";
import FieldLabel from "../ui/FieldLabel";
import TextArea from "../ui/TextArea";
import TextInput from "../ui/TextInput";

const smallButtonClass = "h-9 px-3 text-sm";

interface AdminInquiriesTabProps {
  inquiryList: InquiryListItem[];
  selectedAdminInquiryId: string;
  inquiryDetail: InquiryDetail | undefined;
  commentText: string;
  onChangeInquiryId: (value: string) => void;
  onRefetchDetail: () => void;
  onDeleteInquiry: () => void;
  onSelectInquiry: (id: number) => void;
  onChangeCommentText: (value: string) => void;
  onSubmitComment: (event: FormEvent<HTMLFormElement>) => void;
  onDeleteComment: (id: number) => void;
}

export default function AdminInquiriesTab({
  inquiryList,
  selectedAdminInquiryId,
  inquiryDetail,
  commentText,
  onChangeInquiryId,
  onRefetchDetail,
  onDeleteInquiry,
  onSelectInquiry,
  onChangeCommentText,
  onSubmitComment,
  onDeleteComment,
}: AdminInquiriesTabProps) {
  const inquiryComments = Array.isArray(inquiryDetail?.comments)
    ? inquiryDetail.comments
    : [];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <TextInput
          className="h-10 w-42"
          placeholder="문의 ID"
          value={selectedAdminInquiryId}
          onChange={(event) => onChangeInquiryId(event.target.value)}
        />
        <Button
          type="button"
          variant="outline"
          className="h-10 px-4"
          onClick={onRefetchDetail}
        >
          상세 조회
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="h-10 px-4"
          onClick={onDeleteInquiry}
        >
          문의 삭제
        </Button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.45fr_0.55fr]">
        <div className="space-y-2">
          {inquiryList.map((item) => (
            <button
              key={item.id}
              type="button"
              className="relative w-full rounded-xl border border-line bg-card-soft p-4 text-left transition hover:border-line-strong"
              onClick={() => onSelectInquiry(item.id)}
            >
              <Chip
                tone="soft"
                className={
                  item.has_reply
                    ? "absolute top-3 right-3 bg-success-bg px-3 py-1 text-success-text"
                    : "absolute top-3 right-3 border border-line bg-white px-3 py-1 text-text-main"
                }
              >
                {item.has_reply ? "답변 완료" : "미답변"}
              </Chip>

              <p className="pr-24 text-sm font-medium text-text-main">
                #{item.id} {item.name}
              </p>
              <p className="mt-1 text-xs text-text-muted">{item.phone}</p>
            </button>
          ))}
          {inquiryList.length === 0 ? (
            <p className="text-sm text-text-muted">등록된 문의가 없습니다.</p>
          ) : null}
        </div>

        <div className="rounded-xl border border-line bg-card-soft p-4">
          {inquiryDetail ? (
            <>
              <InquiryDetailCard inquiry={inquiryDetail} />
              <form className="mt-4 space-y-2" onSubmit={onSubmitComment}>
                <FieldLabel required>답변 내용</FieldLabel>
                <TextArea
                  className="mt-2 min-h-22"
                  value={commentText}
                  onChange={(event) => onChangeCommentText(event.target.value)}
                />
                <Button type="submit" className="h-10 px-4">
                  답변 등록
                </Button>
              </form>

              <div className="mt-4 space-y-2">
                {inquiryComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex items-center justify-between gap-2 rounded-lg border border-line bg-card px-3 py-2"
                  >
                    <span className="text-sm text-text-main">
                      #{comment.id} {comment.content}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      className={smallButtonClass}
                      onClick={() => onDeleteComment(comment.id)}
                    >
                      삭제
                    </Button>
                  </div>
                ))}
                {inquiryComments.length === 0 ? (
                  <p className="text-sm text-text-muted">
                    등록된 답변이 없습니다.
                  </p>
                ) : null}
              </div>
            </>
          ) : (
            <p className="text-sm text-text-muted">
              문의 ID를 선택한 뒤 상세 조회를 실행하세요.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function InquiryDetailCard({ inquiry }: { inquiry: InquiryDetail }) {
  const comments = Array.isArray(inquiry.comments) ? inquiry.comments : [];

  return (
    <div className="space-y-1 text-sm text-text-main">
      <p className="text-base font-medium">
        #{inquiry.id} {inquiry.name}
      </p>
      <p>연락처: {inquiry.phone}</p>
      <p>연령대: {inquiry.age || "-"}</p>
      <p>인테리어 타입: {inquiry.interior_type || "-"}</p>
      <p>평수: {inquiry.area || "-"}</p>
      <p>입주 예정일: {inquiry.move_in_date || "-"}</p>
      <p>요청 공사: {inquiry.work_request || "-"}</p>
      <p>기타 요청: {inquiry.content || "-"}</p>
      <p className="text-text-muted">답변 {comments.length}건</p>
    </div>
  );
}
