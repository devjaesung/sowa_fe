import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { sowaApi } from "../api/sowaApi";
import ProjectCard, {
  ProjectCardSkeleton,
} from "../components/common/ProjectCard";
import ButtonLink from "../components/ui/ButtonLink";
import Chip from "../components/ui/Chip";
import InquiryFormSection from "../components/inquiry/InquiryFormSection";
import { useInquiryCreate } from "../components/inquiry/hooks/useInquiryCreate";
import { resolveAssetUrl } from "../shared/assetUrl";

export default function HomePage() {
  const settingsQuery = useQuery({
    queryKey: ["public-settings"],
    queryFn: sowaApi.public.getSettings,
  });

  const portfolioQuery = useQuery({
    queryKey: ["public-works-home"],
    queryFn: () => sowaApi.public.getWorks(),
  });

  const homeInquiryState = useInquiryCreate({
    successMessage: "문의가 등록되었습니다.",
  });

  const rawPortfolio = portfolioQuery.data?.results ?? [];
  const featuredSource = rawPortfolio.some((item) => item.is_featured)
    ? rawPortfolio.filter((item) => item.is_featured)
    : rawPortfolio;
  const featuredProjects = featuredSource.slice(0, 6);
  const heroTitle = settingsQuery.data?.hero_title || "당신의 공간을 특별하게";
  const heroSubtitle =
    settingsQuery.data?.hero_subtitle ||
    "감각적인 레이아웃과 균형 잡힌 디테일로 당신의 라이프스타일에 맞는 공간을 제안합니다.";
  const heroImage =
    resolveAssetUrl(settingsQuery.data?.hero_image) ||
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80";

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.25 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="mx-auto w-full max-w-310 px-5 pb-20 pt-10 sm:px-6 md:pb-24 md:pt-12 lg:py-14"
      >
        <div className="grid items-center gap-8 lg:grid-cols-[0.44fr_0.56fr] lg:gap-10">
          <div>
            <Chip>Interior Design Studio</Chip>
            <h1 className="mt-7 text-4xl font-medium leading-[1.15] text-text-main md:mt-8 md:text-5xl">
              {heroTitle}
            </h1>
            <p className="mt-7 max-w-105 text-base leading-relaxed text-text-muted">
              {heroSubtitle}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <ButtonLink to="/works" shape="pill" className="h-11 px-6">
                포트폴리오 보기
              </ButtonLink>
              <ButtonLink
                to="/contact"
                variant="outline"
                shape="pill"
                className="h-11 px-6"
              >
                문의하기
              </ButtonLink>
            </div>
          </div>

          <div className="relative">
            <img
              src={heroImage}
              alt="SOWA hero"
              className="h-80 w-full rounded-br-lg rounded-tl-[32px] object-cover sm:h-96 md:rounded-tl-[56px] lg:h-135"
            />
            <div className="absolute bottom-4 left-4 rounded-lg bg-card px-5 py-4 shadow-lg md:bottom-6 md:left-6 md:px-6 md:py-5">
              <p className="text-2xl font-bold text-accent md:text-3xl">10+</p>
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-text-muted">
                Projects
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.2 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="mx-auto w-full max-w-310 px-5 pb-20 sm:px-6 md:pb-28"
      >
        <Chip>Featured Projects</Chip>
        <div className="mb-8 flex items-end justify-between gap-4 md:mb-9">
          <div>
            <h2 className="mt-5 text-3xl font-medium text-text-main md:text-4xl">
              주요 프로젝트
            </h2>
          </div>
          <ButtonLink to="/works" variant="ghost" className="shrink-0 px-2 sm:px-4">
            전체 보기 →
          </ButtonLink>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {portfolioQuery.isLoading
            ? Array.from({ length: 6 }, (_, index) => (
                <ProjectCardSkeleton key={`featured-skeleton-${index}`} />
              ))
            : null}
          {portfolioQuery.isError ? (
            <p className="text-sm text-red-600">
              프로젝트를 불러오지 못했습니다.
            </p>
          ) : null}
          {!portfolioQuery.isLoading &&
          !portfolioQuery.isError &&
          featuredProjects.length === 0 ? (
            <p className="text-sm text-text-muted">
              등록된 프로젝트가 없습니다.
            </p>
          ) : null}
          {featuredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              category={project.category?.name ?? "미분류"}
              year={new Date(project.created_at).getFullYear().toString()}
              image={project.thumbnail}
              summary={project.description}
            />
          ))}
        </div>

        <div className="mt-11 text-center">
          <ButtonLink
            to="/works"
            variant="outline"
            shape="pill"
            className="h-11 px-7"
          >
            모든 프로젝트 보기
          </ButtonLink>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.15 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="mx-auto w-full max-w-310 px-5 pb-24 sm:px-6 md:pb-32"
      >
        <div className="grid gap-8 lg:grid-cols-[0.47fr_0.53fr] lg:gap-10">
          <div className="pt-4">
            <Chip>Get In Touch</Chip>
            <h2 className="mt-6 text-3xl font-medium text-text-main md:text-4xl">
              인테리어 문의
            </h2>
            <p className="mt-6 max-w-117.5 text-base leading-relaxed text-text-muted">
              새로운 공간 인테리어를 계획하고 계신가요? 원하는 스타일과 예산,
              일정에 맞춰 상담을 도와드리겠습니다.
            </p>
            <ul className="mt-8 space-y-2 text-sm text-text-muted">
              <li>ech0701@naver.com</li>
              <li>+82 10-9457-7283</li>
              <li className="break-words">서울특별시, 강남구 논현동 123-3번지, 1층</li>
            </ul>
          </div>

          <div className="rounded-lg border border-line bg-card p-5 shadow-sm md:p-8">
            <InquiryFormSection
              variant="embedded"
              form={homeInquiryState.form}
              onSubmitValues={homeInquiryState.onSubmitValues}
              submitErrorMessage={homeInquiryState.submitErrorMessage}
              submitSuccessMessage={homeInquiryState.submitSuccessMessage}
              isSubmitting={homeInquiryState.isSubmitting}
            />
          </div>
        </div>
      </motion.section>
    </>
  );
}
