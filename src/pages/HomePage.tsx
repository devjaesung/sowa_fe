import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { sowaApi } from "../api/sowaApi";
import ProjectCard, {
  ProjectCardSkeleton,
} from "../components/common/ProjectCard";
import Button from "../components/ui/Button";
import ButtonLink from "../components/ui/ButtonLink";
import Chip from "../components/ui/Chip";
import FieldLabel from "../components/ui/FieldLabel";
import RadioOption from "../components/ui/RadioOption";
import TextArea from "../components/ui/TextArea";
import TextInput from "../components/ui/TextInput";
import { useInquiryCreate } from "../components/inquiry/hooks/useInquiryCreate";

export default function HomePage() {
  const settingsQuery = useQuery({
    queryKey: ["public-settings"],
    queryFn: sowaApi.public.getSettings,
  });

  const portfolioQuery = useQuery({
    queryKey: ["public-portfolio-home"],
    queryFn: () => sowaApi.public.getPortfolioImages(),
  });

  const homeInquiryState = useInquiryCreate({
    successMessage: "문의가 등록되었습니다.",
  });

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = homeInquiryState.form;

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 3) {
      return digits;
    }
    if (digits.length <= 7) {
      return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    }
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  };

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
    settingsQuery.data?.hero_image ||
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80";

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.25 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="mx-auto h-screen w-full max-w-310 px-6 pt-12 md:pt-14"
      >
        <div className="grid items-center gap-10 lg:grid-cols-[0.44fr_0.56fr]">
          <div>
            <Chip>Interior Design Studio</Chip>
            <h1 className="mt-8 text-5xl font-medium leading-[1.1] tracking-tight text-text-main md:text-4xl">
              {heroTitle}
            </h1>
            <p className="mt-7 max-w-105 text-base leading-relaxed text-text-muted">
              {heroSubtitle}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <ButtonLink to="/portfolio" shape="pill" className="h-11 px-6">
                포트폴리오 보기
              </ButtonLink>
              <ButtonLink
                to="/inquiry"
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
              className="h-135 w-full rounded-tl-[56px] rounded-br-xl object-cover"
            />
            <div className="absolute bottom-6 left-6 rounded-2xl bg-card px-6 py-5 shadow-lg">
              <p className="text-3xl font-bold text-accent">10+</p>
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
        className="mx-auto w-full max-w-310 px-6 pb-28"
      >
        <Chip>Featured Projects</Chip>
        <div className="mb-9 flex items-baseline justify-between">
          <div>
            <h2 className="mt-5 text-5xl font-medium tracking-tight text-text-main md:text-4xl">
              주요 프로젝트
            </h2>
          </div>
          <ButtonLink to="/portfolio" variant="ghost">
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
              image={project.image}
              summary={project.description}
            />
          ))}
        </div>

        <div className="mt-11 text-center">
          <ButtonLink
            to="/portfolio"
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
        className="mx-auto w-full max-w-310 px-6 pb-32"
      >
        <div className="grid gap-10 lg:grid-cols-[0.47fr_0.53fr]">
          <div className="pt-4">
            <Chip>Get In Touch</Chip>
            <h2 className="mt-6 text-5xl font-medium tracking-tight text-text-main md:text-4xl">
              인테리어 문의
            </h2>
            <p className="mt-6 max-w-117.5 text-base leading-relaxed text-text-muted">
              새로운 공간 인테리어를 계획하고 계신가요? 원하는 스타일과 예산,
              일정에 맞춰 상담을 도와드리겠습니다.
            </p>
            <ul className="mt-8 space-y-2 text-sm text-text-muted">
              <li>ech0701@naver.com</li>
              <li>+82 10-9457-7283</li>
              <li>서울특별시, 강남구 논현동 123-3번지, 1층</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-line bg-card p-7 shadow-sm md:p-8">
            <form
              className="space-y-4"
              onSubmit={handleSubmit(homeInquiryState.onSubmitValues)}
            >
              <FieldLabel required>이름</FieldLabel>
              <TextInput
                {...register("name")}
                placeholder="이름을 입력해주세요."
                className="h-11 px-4"
                maxLength={10}
              />
              {errors.name ? (
                <p className="text-xs text-red-600">{errors.name.message}</p>
              ) : null}

              <FieldLabel required>연락처</FieldLabel>
              <TextInput
                value={watch("phone")}
                onValueChange={(value) =>
                  setValue("phone", formatPhone(value), {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  })
                }
                placeholder="연락처를 입력해주세요."
                className="h-11 px-4"
                inputMode="numeric"
                maxLength={13}
              />
              {errors.phone ? (
                <p className="text-xs text-red-600">{errors.phone.message}</p>
              ) : null}

              <div>
                <FieldLabel required>비밀번호</FieldLabel>
                <TextInput
                  value={watch("password")}
                  onValueChange={(value) =>
                    setValue("password", value, {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    })
                  }
                  type="password"
                  placeholder="글 조회 시 필요한 비밀번호입니다."
                  className="mt-4 h-11 px-4"
                  maxLength={50}
                />
                {errors.password ? (
                  <p className="mt-2 text-xs text-red-600">
                    {errors.password.message}
                  </p>
                ) : null}
                <p className="mt-2 text-xs text-text-muted">
                  문의 내용 확인 시 필요합니다.
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-text-main">연령대</p>
                <div className="mt-2 flex flex-wrap gap-5 text-sm text-text-main">
                  <RadioOption
                    checked={watch("age") === "20"}
                    name="home-age"
                    onChange={() =>
                      setValue("age", "20", {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                    label="20대"
                  />
                  <RadioOption
                    checked={watch("age") === "30"}
                    name="home-age"
                    onChange={() =>
                      setValue("age", "30", {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                    label="30대"
                  />
                  <RadioOption
                    checked={watch("age") === "40"}
                    name="home-age"
                    onChange={() =>
                      setValue("age", "40", {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                    label="40대"
                  />
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-text-main">
                  인테리어 종류
                </p>
                <div className="mt-2 flex flex-wrap gap-5 text-sm text-text-main">
                  <RadioOption
                    checked={watch("interiorType") === "residential"}
                    name="home-interior-type"
                    onChange={() =>
                      setValue("interiorType", "residential", {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                    label="주거"
                  />
                  <RadioOption
                    checked={watch("interiorType") === "commercial"}
                    name="home-interior-type"
                    onChange={() =>
                      setValue("interiorType", "commercial", {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                    label="상업"
                  />
                </div>
              </div>

              <FieldLabel>평수</FieldLabel>
              <TextInput
                {...register("area")}
                placeholder="예: 32평"
                className="h-11 px-4"
              />

              <FieldLabel>입주 예상 날짜</FieldLabel>
              <TextInput
                {...register("moveInDate")}
                type="date"
                className=" h-11 px-4"
              />

              <FieldLabel>원하는 공사</FieldLabel>
              <TextArea
                {...register("workRequest")}
                placeholder="원하시는 공사 내용을 입력해주세요."
                className="mt-2 min-h-28 px-4 py-3"
              />

              <FieldLabel>기타 요구사항</FieldLabel>
              <TextArea
                {...register("content")}
                placeholder="기타 요구사항을 입력해주세요."
                className="min-h-28 px-4 py-3"
              />

              {homeInquiryState.submitErrorMessage ? (
                <p className="text-sm text-red-600">
                  {homeInquiryState.submitErrorMessage}
                </p>
              ) : null}
              {homeInquiryState.submitSuccessMessage ? (
                <p className="text-sm text-green-600">
                  {homeInquiryState.submitSuccessMessage}
                </p>
              ) : null}

              <Button
                type="submit"
                full
                className=" h-12 rounded-lg"
                disabled={homeInquiryState.isSubmitting}
              >
                {homeInquiryState.isSubmitting ? "등록 중..." : "문의 등록"}
              </Button>
            </form>
          </div>
        </div>
      </motion.section>
    </>
  );
}
