import type { UseFormReturn } from "react-hook-form";
import Button from "../ui/Button";
import FieldLabel from "../ui/FieldLabel";
import RadioOption from "../ui/RadioOption";
import Select from "../ui/Select";
import TextArea from "../ui/TextArea";
import TextInput from "../ui/TextInput";
import { cn } from "../ui/cn";
import type { InquiryFormValues } from "./inquiryFormSchema";
import { REFERRAL_SOURCE_OPTIONS } from "./referralSources";

interface InquiryFormSectionProps {
  form: UseFormReturn<InquiryFormValues>;
  onSubmitValues: (values: InquiryFormValues) => void;
  onCancel?: () => void;
  submitErrorMessage?: string;
  submitSuccessMessage?: string;
  isSubmitting?: boolean;
  variant?: "card" | "embedded";
}

export default function InquiryFormSection({
  form,
  onSubmitValues,
  onCancel,
  submitErrorMessage = "",
  submitSuccessMessage = "",
  isSubmitting = false,
  variant = "card",
}: InquiryFormSectionProps) {
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = form;
  const referralSource = watch("referralSource");

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
    <div
      className={cn(
        variant === "card" &&
          "mx-auto max-w-280 rounded-lg border border-line bg-card p-4 shadow-sm sm:p-5 md:p-6",
      )}
    >
      <form
        className={cn(variant === "card" ? "grid gap-4 lg:grid-cols-2" : "space-y-4")}
        onSubmit={handleSubmit(onSubmitValues)}
      >
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

          <FieldLabel label="희망예산" />
          <TextInput
            {...register("desiredBudget")}
            placeholder="예: 5000만원~7000만원"
            maxLength={100}
          />
          {errors.desiredBudget ? (
            <p className="text-xs text-red-600">{errors.desiredBudget.message}</p>
          ) : null}

          <FieldLabel label="공사 시작 희망일" />
          <TextInput
            {...register("constructionStartDate")}
            type="date"
          />

          <FieldLabel label="알게 된 경로" />
          <Select
            value={referralSource}
            placeholder="경로를 선택해주세요"
            options={REFERRAL_SOURCE_OPTIONS}
            onChange={(value) => {
              const nextValue = value as InquiryFormValues["referralSource"];
              setValue("referralSource", nextValue, {
                shouldDirty: true,
                shouldValidate: true,
              });
              if (nextValue !== "other") {
                setValue("referralSourceOther", "", {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }
            }}
          />

          {referralSource === "other" ? (
            <>
              <FieldLabel label="기타 경로" />
              <TextInput
                {...register("referralSourceOther")}
                placeholder="알게 된 경로를 입력해주세요"
                maxLength={200}
              />
              {errors.referralSourceOther ? (
                <p className="text-xs text-red-600">
                  {errors.referralSourceOther.message}
                </p>
              ) : null}
            </>
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
          <p className={cn("text-sm text-red-600", variant === "card" && "lg:col-span-2")}>
            {submitErrorMessage}
          </p>
        ) : null}

        {submitSuccessMessage ? (
          <p className={cn("text-sm text-emerald-700", variant === "card" && "lg:col-span-2")}>
            {submitSuccessMessage}
          </p>
        ) : null}

        <div
          className={cn(
            "flex flex-col justify-center gap-3 pt-1 sm:flex-row",
            variant === "card" && "lg:col-span-2",
          )}
        >
          {onCancel ? (
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="h-11 w-full border-line-strong px-5 hover:bg-card-soft sm:w-auto sm:min-w-28"
              disabled={isSubmitting}
            >
              취소
            </Button>
          ) : null}
          <Button
            type="submit"
            className={cn(
              "h-11 w-full px-7",
              variant === "card" && "sm:w-auto sm:min-w-36",
            )}
            disabled={isSubmitting}
          >
            {isSubmitting ? "등록 중..." : "문의 등록"}
          </Button>
        </div>
      </form>
    </div>
  );
}
