import type { FormEvent } from "react";
import Button from "../ui/Button";
import FieldLabel from "../ui/FieldLabel";
import TextInput from "../ui/TextInput";
import type { NoticeState } from "./types";
import { Notice } from "./AdminCommon";

interface AdminLoginViewProps {
  loginForm: { username: string; password: string };
  notice: NoticeState | null;
  isSubmitting: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onChangeUsername: (value: string) => void;
  onChangePassword: (value: string) => void;
}

export default function AdminLoginView({
  loginForm,
  notice,
  isSubmitting,
  onSubmit,
  onChangeUsername,
  onChangePassword,
}: AdminLoginViewProps) {
  return (
    <div className="min-h-screen bg-surface-muted px-6 py-14 md:py-20">
      <div className="mx-auto w-full max-w-120 space-y-6">
        <section className="rounded-2xl border border-line bg-card p-7 shadow-sm md:p-8">
          <p className="mb-2 text-xs uppercase tracking-[0.14em] text-text-subtle">SOWA Admin</p>
          <h1 className="text-3xl font-medium tracking-tight text-text-main md:text-4xl">관리자 로그인</h1>
          <p className="mt-3 text-sm leading-relaxed text-text-muted">
            관리자 페이지는 공개 네비게이션에 노출되지 않으며, <strong>/admin</strong> URL 직접 접근 후
            관리자 인증이 완료된 경우에만 진입 가능합니다.
          </p>
          <form className="mt-7 space-y-4" onSubmit={onSubmit}>
            <div>
              <FieldLabel required>Username</FieldLabel>
              <TextInput
                value={loginForm.username}
                onChange={(event) => onChangeUsername(event.target.value)}
                placeholder="관리자 계정"
                className="mt-2 h-11"
              />
            </div>
            <div>
              <FieldLabel required>Password</FieldLabel>
              <TextInput
                type="password"
                value={loginForm.password}
                onChange={(event) => onChangePassword(event.target.value)}
                placeholder="비밀번호"
                className="mt-2 h-11"
              />
            </div>
            {notice ? <Notice tone={notice.tone} message={notice.message} /> : null}
            <Button type="submit" className="h-11 w-full" disabled={isSubmitting}>
              {isSubmitting ? "로그인 중..." : "로그인"}
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}
