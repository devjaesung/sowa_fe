import { useMemo } from "react";
import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { sowaApi } from "../api/sowaApi";
import type { RoleEnum } from "../api/types";
import Chip from "../components/ui/Chip";
import Skeleton from "../components/ui/Skeleton";

const TEAM_ROLE_ORDER: RoleEnum[] = ["manager", "assistant", "staff"];

export default function StoryPage() {
  const historyQuery = useQuery({
    queryKey: ["public-story-history"],
    queryFn: sowaApi.public.getHistory,
  });

  const membersQuery = useQuery({
    queryKey: ["public-story-members"],
    queryFn: sowaApi.public.getMembers,
  });

  const history = historyQuery.data ?? [];

  // data가 undefined일 때 ?? [] 로 매번 새 참조가 생기지 않도록 useMemo로 안정화
  const members = useMemo(() => membersQuery.data ?? [], [membersQuery.data]);

  const directors = useMemo(
    () => members.filter((m) => m.role === "director"),
    [members],
  );

  const teamGroups = useMemo(() => {
    return TEAM_ROLE_ORDER.map((role) => ({
      role,
      members: members.filter((m) => m.role === role),
    })).filter((group) => group.members.length > 0);
  }, [members]);

  return (
    <>
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.15 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="mx-auto w-full max-w-310 px-6 pb-20 pt-20"
      >
        <Chip>Our Story</Chip>
        <h1 className="mt-6 text-5xl font-medium tracking-tight text-text-main md:text-4xl">
          SOWA의 이야기
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-text-muted">
          감각적인 공간을 만드는 사람들. SOWA는 공간을 통해 삶의 방식을
          제안합니다. 설립부터 현재까지, 저희의 발자취를 소개합니다.
        </p>
      </motion.section>

      {/* History */}
      <motion.section
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.15 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="mx-auto w-full max-w-310 px-6 pb-28"
      >
        <h2 className="mb-10 text-3xl font-medium tracking-tight text-text-main">
          주요 연혁
        </h2>

        {historyQuery.isLoading ? (
          <div className="space-y-6 border-l-2 border-line pl-8">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-3 w-64" />
              </div>
            ))}
          </div>
        ) : null}

        {historyQuery.isError ? (
          <p className="text-sm text-red-600">연혁을 불러오지 못했습니다.</p>
        ) : null}

        {!historyQuery.isLoading && !historyQuery.isError && history.length === 0 ? (
          <p className="text-sm text-text-muted">등록된 연혁이 없습니다.</p>
        ) : null}

        {history.length > 0 && (
          <div className="relative space-y-8 border-l-2 border-line pl-8">
            {history.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ amount: 0.5 }}
                transition={{ duration: 0.4, delay: i * 0.04, ease: "easeOut" }}
                className="relative"
              >
                <span className="absolute -left-[2.6rem] top-1 h-3 w-3 rounded-full border-2 border-accent bg-card" />
                <span className="mr-5 text-sm font-semibold text-accent">
                  {item.year}
                </span>
                <span className="text-sm text-text-main">{item.content}</span>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      {/* Directors */}
      {(membersQuery.isLoading || directors.length > 0) && (
        <motion.section
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.15 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mx-auto w-full max-w-310 px-6 pb-28"
        >
          <h2 className="mb-12 text-3xl font-medium tracking-tight text-text-main">
            주요 인물 약력
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            {membersQuery.isLoading
              ? Array.from({ length: 3 }, (_, i) => (
                  <div
                    key={i}
                    className="space-y-4 rounded-2xl border border-line bg-card p-7 shadow-sm"
                  >
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-6 w-32" />
                    <div className="border-t border-line pt-4 space-y-2">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-4/5" />
                    </div>
                    <div className="border-t border-line pt-4 space-y-2">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  </div>
                ))
              : directors.map((member, i) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ amount: 0.2 }}
                    transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                    className="rounded-2xl border border-line bg-card p-7 shadow-sm"
                  >
                    <p className="text-xs font-medium uppercase tracking-widest text-accent">
                      {member.role_display}
                      {member.title ? ` / ${member.title}` : ""}
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-text-main">
                      {member.name}
                    </h3>

                    {member.education && (
                      <>
                        <div className="my-5 border-t border-line" />
                        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-text-subtle">
                          학력
                        </p>
                        <p className="whitespace-pre-line text-sm leading-relaxed text-text-muted">
                          {member.education}
                        </p>
                      </>
                    )}

                    {member.career && (
                      <>
                        <div className="my-5 border-t border-line" />
                        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-text-subtle">
                          경력
                        </p>
                        <p className="whitespace-pre-line text-sm leading-relaxed text-text-muted">
                          {member.career}
                        </p>
                      </>
                    )}
                  </motion.div>
                ))}
          </div>
        </motion.section>
      )}

      {/* Team */}
      {(membersQuery.isLoading || teamGroups.length > 0) && (
        <motion.section
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.15 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mx-auto w-full max-w-310 px-6 pb-32"
        >
          <h2 className="mb-12 text-3xl font-medium tracking-tight text-text-main">
            팀 구성
          </h2>

          {membersQuery.isLoading ? (
            <div className="space-y-10">
              {Array.from({ length: 2 }, (_, i) => (
                <div key={i}>
                  <Skeleton className="mb-4 h-3 w-10" />
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {Array.from({ length: 2 }, (_, j) => (
                      <Skeleton key={j} className="h-14 rounded-xl" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-10">
              {teamGroups.map((group) => (
                <div key={group.role}>
                  <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-text-subtle">
                    {group.members[0]?.role_display}
                  </p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {group.members.map((m) => (
                      <div
                        key={m.id}
                        className="rounded-xl border border-line bg-card px-5 py-4"
                      >
                        <p className="text-base font-semibold text-text-main">
                          {m.name}
                        </p>
                        {m.title && (
                          <p className="mt-0.5 text-xs text-text-subtle">{m.title}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.section>
      )}
    </>
  );
}
