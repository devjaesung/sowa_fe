import InquiryFormSection from "../components/inquiry/InquiryFormSection";
import { useInquiryCreate } from "../components/inquiry/hooks/useInquiryCreate";
import { initialInquiryFormValues } from "../components/inquiry/inquiryFormSchema";

const MAP_ADDRESS = "서울특별시 강남구 논현동 123-3번지, 1층";
const MAP_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(MAP_ADDRESS)}&output=embed`;

export default function InquiryPage() {
  const inquiryCreateState = useInquiryCreate({
    successMessage: "문의가 등록되었습니다.",
  });

  return (
    <div className="bg-surface-muted">
      <section className="border-y border-line px-5 py-8 text-center sm:px-6 md:py-10">
        <h1 className="text-2xl font-medium tracking-[-0.01em] text-text-main md:text-4xl">
          문의하기
        </h1>
        <div className="mt-4 flex flex-col items-center gap-1 text-sm text-text-muted">
          <span>서울특별시 강남구 논현동 123-3번지, 1층</span>
          <a href="mailto:ech0701@naver.com" className="transition-colors hover:text-text-main">
            ech0701@naver.com
          </a>
        </div>
      </section>

      <section className="mx-auto w-full max-w-310 px-4 py-8 sm:px-6 md:py-12">
        <InquiryFormSection
          form={inquiryCreateState.form}
          onCancel={() => {
            inquiryCreateState.setSubmitErrorMessage("");
            inquiryCreateState.setSubmitSuccessMessage("");
            inquiryCreateState.form.reset(initialInquiryFormValues);
          }}
          onSubmitValues={inquiryCreateState.onSubmitValues}
          submitErrorMessage={inquiryCreateState.submitErrorMessage}
          submitSuccessMessage={inquiryCreateState.submitSuccessMessage}
          isSubmitting={inquiryCreateState.isSubmitting}
        />

        <div className="mx-auto mt-10 max-w-280">
          <h2 className="mb-4 text-xl font-medium text-text-main md:text-2xl">오시는 길</h2>
          <iframe
            title="SOWA 오시는 길"
            src={MAP_EMBED_SRC}
            className="min-h-72 w-full rounded-lg border border-line bg-card md:aspect-[16/7]"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </div>
  );
}
