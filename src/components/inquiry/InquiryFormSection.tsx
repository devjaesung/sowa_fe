import type { UseFormReturn } from "react-hook-form";
import Button from "../ui/Button";
import FieldLabel from "../ui/FieldLabel";
import RadioOption from "../ui/RadioOption";
import TextArea from "../ui/TextArea";
import TextInput from "../ui/TextInput";
import type { InquiryFormValues } from "./inquiryFormSchema";

interface InquiryFormSectionProps {
  form: UseFormReturn<InquiryFormValues>;
  onSubmitValues: (values: InquiryFormValues) => void;
  onCancel: () => void;
  submitErrorMessage?: string;
  submitSuccessMessage?: string;
  isSubmitting?: boolean;
}

export default function InquiryFormSection({
  form,
  onSubmitValues,
  onCancel,
  submitErrorMessage = "",
  submitSuccessMessage = "",
  isSubmitting = false,
}: InquiryFormSectionProps) {
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = form;

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

  return (
    <div className="mx-auto max-w-280 rounded-2xl border border-line bg-card p-5 shadow-sm md:p-6">
      <form className="grid gap-4 lg:grid-cols-2" onSubmit={handleSubmit(onSubmitValues)}>
        <div className="space-y-1">
          <FieldLabel label="이름" required />
          <TextInput
            {...register("name")}
            placeholder="이름을 입력해주세요"
            maxLength={10}
            required
          />
          {errors.name ? (
            <p className="text-xs text-red-600">{errors.name.message}</p>
          ) : null}

          <FieldLabel label="연락처" required />
          <TextInput
            value={watch("phone")}
            onValueChange={(value) =>
              setValue("phone", formatPhone(value), {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              })
            }
            placeholder="연락처를 입력해주세요"
            inputMode="numeric"
            maxLength={13}
            required
          />
          {errors.phone ? (
            <p className="text-xs text-red-600">{errors.phone.message}</p>
          ) : null}

          <FieldLabel label="연령대" />
          <div className="flex flex-wrap gap-5 text-sm text-text-main">
            <RadioOption
              checked={watch("age") === "20"}
              label="20대"
              name="age"
              onChange={() => setValue("age", "20", { shouldDirty: true, shouldValidate: true })}
            />
            <RadioOption
              checked={watch("age") === "30"}
              label="30대"
              name="age"
              onChange={() => setValue("age", "30", { shouldDirty: true, shouldValidate: true })}
            />
            <RadioOption
              checked={watch("age") === "40"}
              label="40대"
              name="age"
              onChange={() => setValue("age", "40", { shouldDirty: true, shouldValidate: true })}
            />
          </div>

          <FieldLabel label="인테리어 종류" />
          <div className="flex flex-wrap gap-5 text-sm text-text-main">
            <RadioOption
              checked={watch("interiorType") === "residential"}
              label="주거"
              name="interiorType"
              onChange={() =>
                setValue("interiorType", "residential", { shouldDirty: true, shouldValidate: true })
              }
            />
            <RadioOption
              checked={watch("interiorType") === "commercial"}
              label="상업"
              name="interiorType"
              onChange={() =>
                setValue("interiorType", "commercial", { shouldDirty: true, shouldValidate: true })
              }
            />
          </div>
        </div>

        <div className="space-y-1">
          <FieldLabel label="평수" />
          <TextInput
            {...register("area")}
            placeholder="예: 32평"
          />

          <FieldLabel label="입주 예상 날짜" />
          <TextInput
            {...register("moveInDate")}
            type="date"
          />

          <FieldLabel label="공사 시작 희망일" />
          <TextInput
            {...register("constructionStartDate")}
            type="date"
          />

          <FieldLabel label="희망예산" />
          <TextInput
            {...register("desiredBudget")}
            placeholder="예: 5000만원~7000만원"
          />

          <FieldLabel label="알게 된 경로" />
          <div className="flex flex-wrap gap-5 text-sm text-text-main">
            <RadioOption
              checked={watch("referralSource") === "blog"}
              label="블로그"
              name="referralSource"
              onChange={() => setValue("referralSource", "blog", { shouldDirty: true })}
            />
            <RadioOption
              checked={watch("referralSource") === "youtube"}
              label="유튜브"
              name="referralSource"
              onChange={() => setValue("referralSource", "youtube", { shouldDirty: true })}
            />
            <RadioOption
              checked={watch("referralSource") === "other"}
              label="기타"
              name="referralSource"
              onChange={() => setValue("referralSource", "other", { shouldDirty: true })}
            />
          </div>
          {watch("referralSource") === "other" ? (
            <TextInput
              {...register("referralSourceOther")}
              placeholder="알게 된 경로를 입력해주세요"
            />
          ) : null}

          <FieldLabel label="원하는 공사" />
          <TextArea
            {...register("workRequest")}
            placeholder="원하시는 공사 내용을 입력해주세요"
          />

          <FieldLabel label="기타 요구사항" />
          <TextArea
            {...register("content")}
            placeholder="기타 요구사항을 입력해주세요"
          />
        </div>

        {submitErrorMessage ? (
          <p className="text-sm text-red-600 lg:col-span-2">{submitErrorMessage}</p>
        ) : null}
        {submitSuccessMessage ? (
          <p className="text-sm text-green-700 lg:col-span-2">{submitSuccessMessage}</p>
        ) : null}

        <div className="flex justify-center gap-3 pt-1 lg:col-span-2">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="h-11 min-w-28 border-line-strong px-5 hover:bg-card-soft"
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button
            type="submit"
            className="h-11 min-w-36 px-7"
            disabled={isSubmitting}
          >
            {isSubmitting ? "등록 중..." : "문의 등록"}
          </Button>
        </div>
      </form>
    </div>
  );
}
