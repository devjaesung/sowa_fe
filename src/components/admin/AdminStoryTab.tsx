import type { FormEvent } from "react";
import type { CompanyHistory, TeamMember } from "../../api/types";
import Button from "../ui/Button";
import FieldLabel from "../ui/FieldLabel";
import Select from "../ui/Select";
import TextArea from "../ui/TextArea";
import TextInput from "../ui/TextInput";
import type {
  HistoryEditorMode,
  HistoryFormState,
  MemberEditorMode,
  MemberFormState,
} from "./types";

const ROLE_OPTIONS = [
  { label: "소장", value: "director" },
  { label: "팀장", value: "manager" },
  { label: "대리", value: "assistant" },
  { label: "사원", value: "staff" },
];

interface AdminStoryTabProps {
  historyList: CompanyHistory[];
  memberList: TeamMember[];
  historyEditorMode: HistoryEditorMode;
  historyEditId: number | null;
  historyForm: HistoryFormState;
  memberEditorMode: MemberEditorMode;
  memberEditId: number | null;
  memberForm: MemberFormState;
  onOpenCreateHistory: () => void;
  onCloseHistoryEditor: () => void;
  onChangeHistoryForm: (next: HistoryFormState) => void;
  onSubmitHistory: (event: FormEvent<HTMLFormElement>) => void;
  onEditHistory: (item: CompanyHistory) => void;
  onDeleteHistory: (id: number) => void;
  onOpenCreateMember: () => void;
  onCloseMemberEditor: () => void;
  onChangeMemberForm: (next: MemberFormState) => void;
  onSubmitMember: (event: FormEvent<HTMLFormElement>) => void;
  onEditMember: (item: TeamMember) => void;
  onDeleteMember: (id: number) => void;
}

export default function AdminStoryTab({
  historyList,
  memberList,
  historyEditorMode,
  historyForm,
  memberEditorMode,
  memberForm,
  onOpenCreateHistory,
  onCloseHistoryEditor,
  onChangeHistoryForm,
  onSubmitHistory,
  onEditHistory,
  onDeleteHistory,
  onOpenCreateMember,
  onCloseMemberEditor,
  onChangeMemberForm,
  onSubmitMember,
  onEditMember,
  onDeleteMember,
}: AdminStoryTabProps) {
  return (
    <div className="space-y-10">
      {/* ─── 연혁 ─── */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-main">연혁</h3>
          <Button type="button" className="h-9 px-4 text-sm" onClick={onOpenCreateHistory}>
            연혁 추가
          </Button>
        </div>

        {historyEditorMode && (
          <form
            className="mb-5 grid gap-4 rounded-xl border border-line bg-card-soft p-4 md:grid-cols-2"
            onSubmit={onSubmitHistory}
          >
            <div>
              <FieldLabel required>연도</FieldLabel>
              <TextInput
                className="mt-2"
                placeholder="예: 2024"
                value={historyForm.year}
                onChange={(e) => onChangeHistoryForm({ ...historyForm, year: e.target.value })}
              />
            </div>

            <div>
              <FieldLabel>순서</FieldLabel>
              <TextInput
                className="mt-2"
                type="number"
                value={historyForm.order}
                onChange={(e) => onChangeHistoryForm({ ...historyForm, order: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <FieldLabel required>내용</FieldLabel>
              <TextArea
                className="mt-2 min-h-20"
                placeholder="연혁 내용을 입력하세요"
                value={historyForm.content}
                onChange={(e) => onChangeHistoryForm({ ...historyForm, content: e.target.value })}
              />
            </div>

            <div className="flex flex-wrap gap-2 md:col-span-2">
              <Button type="submit" className="h-9 px-4 text-sm">
                {historyEditorMode === "create" ? "추가" : "수정 저장"}
              </Button>
              <Button type="button" variant="outline" className="h-9 px-4 text-sm" onClick={onCloseHistoryEditor}>
                닫기
              </Button>
            </div>
          </form>
        )}

        {historyList.length === 0 ? (
          <p className="text-sm text-text-muted">등록된 연혁이 없습니다.</p>
        ) : (
          <div className="divide-y divide-line rounded-xl border border-line bg-card overflow-hidden">
            {historyList.map((item) => (
              <div key={item.id} className="flex items-start justify-between gap-4 px-5 py-4">
                <div className="min-w-0">
                  <span className="mr-3 text-sm font-semibold text-accent">{item.year}</span>
                  <span className="text-sm text-text-main">{item.content}</span>
                  <span className="ml-3 text-xs text-text-subtle">순서 {item.order ?? 0}</span>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-8 px-3 text-xs"
                    onClick={() => onEditHistory(item)}
                  >
                    수정
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-8 px-3 text-xs text-rose-700 hover:text-rose-800"
                    onClick={() => onDeleteHistory(item.id)}
                  >
                    삭제
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ─── 팀원 ─── */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-main">팀원</h3>
          <Button type="button" className="h-9 px-4 text-sm" onClick={onOpenCreateMember}>
            팀원 추가
          </Button>
        </div>

        {memberEditorMode && (
          <form
            className="mb-5 grid gap-4 rounded-xl border border-line bg-card-soft p-4 md:grid-cols-2"
            onSubmit={onSubmitMember}
          >
            <div>
              <FieldLabel required>직책</FieldLabel>
              <Select
                className="mt-2"
                value={memberForm.role}
                placeholder="직책 선택"
                options={ROLE_OPTIONS}
                onChange={(value) => onChangeMemberForm({ ...memberForm, role: value })}
              />
            </div>

            <div>
              <FieldLabel required>이름</FieldLabel>
              <TextInput
                className="mt-2"
                value={memberForm.name}
                onChange={(e) => onChangeMemberForm({ ...memberForm, name: e.target.value })}
              />
            </div>

            <div>
              <FieldLabel>자격 (예: 건축사)</FieldLabel>
              <TextInput
                className="mt-2"
                value={memberForm.title}
                onChange={(e) => onChangeMemberForm({ ...memberForm, title: e.target.value })}
              />
            </div>

            <div>
              <FieldLabel>순서</FieldLabel>
              <TextInput
                className="mt-2"
                type="number"
                value={memberForm.order}
                onChange={(e) => onChangeMemberForm({ ...memberForm, order: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <FieldLabel>학력</FieldLabel>
              <TextArea
                className="mt-2 min-h-20"
                placeholder="학력 정보를 입력하세요 (줄바꿈 가능)"
                value={memberForm.education}
                onChange={(e) => onChangeMemberForm({ ...memberForm, education: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <FieldLabel>경력</FieldLabel>
              <TextArea
                className="mt-2 min-h-20"
                placeholder="경력 정보를 입력하세요 (줄바꿈 가능)"
                value={memberForm.career}
                onChange={(e) => onChangeMemberForm({ ...memberForm, career: e.target.value })}
              />
            </div>

            <div className="flex flex-wrap gap-2 md:col-span-2">
              <Button type="submit" className="h-9 px-4 text-sm">
                {memberEditorMode === "create" ? "추가" : "수정 저장"}
              </Button>
              <Button type="button" variant="outline" className="h-9 px-4 text-sm" onClick={onCloseMemberEditor}>
                닫기
              </Button>
            </div>
          </form>
        )}

        {memberList.length === 0 ? (
          <p className="text-sm text-text-muted">등록된 팀원이 없습니다.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {memberList.map((member) => (
              <div
                key={member.id}
                className="rounded-xl border border-line bg-card px-5 py-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-accent">
                      {member.role_display}
                      {member.title ? ` / ${member.title}` : ""}
                    </p>
                    <p className="mt-1 text-base font-semibold text-text-main">{member.name}</p>
                    <p className="mt-0.5 text-xs text-text-subtle">순서 {member.order ?? 0}</p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-7 px-2 text-xs"
                      onClick={() => onEditMember(member)}
                    >
                      수정
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-7 px-2 text-xs text-rose-700 hover:text-rose-800"
                      onClick={() => onDeleteMember(member.id)}
                    >
                      삭제
                    </Button>
                  </div>
                </div>
                {(member.education || member.career) && (
                  <div className="mt-3 space-y-1 border-t border-line pt-3">
                    {member.education && (
                      <p className="text-xs text-text-muted line-clamp-2">학력: {member.education}</p>
                    )}
                    {member.career && (
                      <p className="text-xs text-text-muted line-clamp-2">경력: {member.career}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
