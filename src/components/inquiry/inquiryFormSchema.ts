import { z } from "zod";

export const inquiryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "이름을 입력해주세요.")
    .max(10, "이름은 10자 이하로 입력해주세요."),
  phone: z
    .string()
    .regex(/^\d{3}-\d{4}-\d{4}$/, "연락처는 000-0000-0000 형식으로 입력해주세요."),
  age: z.enum(["", "20", "30", "40"]),
  interiorType: z.enum(["", "residential", "commercial"]),
  area: z.string(),
  moveInDate: z.string(),
  desiredBudget: z.string().max(100, "희망예산은 100자 이하로 입력해주세요."),
  constructionStartDate: z.string(),
  referralSource: z.enum([
    "",
    "acquaintance",
    "blog",
    "youtube",
    "instagram",
    "other",
  ]),
  referralSourceOther: z
    .string()
    .max(200, "기타 경로는 200자 이하로 입력해주세요."),
  workRequest: z.string(),
  content: z.string(),
});

export type InquiryFormValues = z.infer<typeof inquiryFormSchema>;

export const initialInquiryFormValues: InquiryFormValues = {
  name: "",
  phone: "",
  age: "",
  interiorType: "",
  area: "",
  moveInDate: "",
  desiredBudget: "",
  constructionStartDate: "",
  referralSource: "",
  referralSourceOther: "",
  workRequest: "",
  content: "",
};
