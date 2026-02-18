import { useState } from "react";
import InquiryFormSection from "../components/inquiry/InquiryFormSection";
import InquiryListSection from "../components/inquiry/InquiryListSection";
import { useInquiryCreate } from "../components/inquiry/hooks/useInquiryCreate";
import { useInquiryDetail } from "../components/inquiry/hooks/useInquiryDetail";
import { useInquiryList } from "../components/inquiry/hooks/useInquiryList";
import { parseErrorMessage } from "../shared/error";

export default function InquiryPage() {
  const [isWriting, setIsWriting] = useState(false);
  const inquiryListState = useInquiryList();
  const inquiryDetailState = useInquiryDetail();
  const inquiryCreateState = useInquiryCreate({
    onCreated: () => {
      setIsWriting(false);
      inquiryListState.resetToFirstPage();
    },
  });

  return (
    <div className="bg-surface-muted">
      {!isWriting ? (
        <section className="border-y border-line px-6 py-10 text-center">
          <h1 className="text-2xl font-medium tracking-[-0.01em] text-text-main md:text-4xl">
            문의하기
          </h1>
        </section>
      ) : null}

      <section
        className={`mx-auto w-full max-w-310 px-6 ${
          isWriting ? "py-6 md:py-7" : "py-10 md:py-12"
        }`}
      >
        {isWriting ? (
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                inquiryCreateState.setSubmitErrorMessage("");
                setIsWriting(false);
              }}
              className="inline-flex items-center px-1 text-sm font-medium text-text-main transition hover:text-text-muted"
            >
              ← 뒤로가기
            </button>
            <InquiryFormSection
              form={inquiryCreateState.form}
              onCancel={() => {
                inquiryCreateState.setSubmitErrorMessage("");
                setIsWriting(false);
              }}
              onSubmitValues={inquiryCreateState.onSubmitValues}
              submitErrorMessage={inquiryCreateState.submitErrorMessage}
              isSubmitting={inquiryCreateState.isSubmitting}
            />
          </div>
        ) : (
          <InquiryListSection
            inquiries={inquiryListState.pagedInquiries}
            totalCount={inquiryListState.inquiries.length}
            currentPage={inquiryListState.currentPage}
            totalPages={inquiryListState.totalPages}
            onPageChange={(nextPage) => {
              inquiryListState.setCurrentPage(nextPage);
              inquiryDetailState.onResetForListChange();
            }}
            onSelectDetail={inquiryDetailState.onSelectDetail}
            selectedInquiryId={inquiryDetailState.selectedInquiryId}
            selectedDetail={inquiryDetailState.selectedDetail}
            isPasswordRequired={inquiryDetailState.isPasswordRequired}
            detailPassword={inquiryDetailState.detailPassword}
            detailErrorMessage={inquiryDetailState.detailErrorMessage}
            isDetailLoading={inquiryDetailState.isDetailLoading}
            onDetailPasswordChange={inquiryDetailState.onDetailPasswordChange}
            onVerifyDetail={inquiryDetailState.onVerifyDetail}
            onCloseDetail={inquiryDetailState.onCloseDetail}
            onWrite={() => {
              inquiryListState.resetToFirstPage();
              inquiryDetailState.onResetForListChange();
              setIsWriting(true);
            }}
            isLoading={inquiryListState.inquiryListQuery.isLoading}
            errorMessage={
              inquiryListState.inquiryListQuery.isError
                ? parseErrorMessage(inquiryListState.inquiryListQuery.error)
                : ""
            }
          />
        )}
      </section>
    </div>
  );
}
