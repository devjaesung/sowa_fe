import type { ReferralSource } from "../../api/types";

export const REFERRAL_SOURCE_OPTIONS: Array<{
  label: string;
  value: ReferralSource;
}> = [
  { label: "지인", value: "acquaintance" },
  { label: "블로그", value: "blog" },
  { label: "유튜브", value: "youtube" },
  { label: "인스타그램", value: "instagram" },
  { label: "기타", value: "other" },
];

export const getReferralSourceLabel = (value?: string | null) =>
  REFERRAL_SOURCE_OPTIONS.find((option) => option.value === value)?.label ?? value ?? "-";
