import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { sowaApi } from "../../../api/sowaApi";
import { parseErrorMessage } from "../../../shared/error";
import {
  inquiryFormSchema,
  initialInquiryFormValues,
  type InquiryFormValues,
} from "../inquiryFormSchema";

interface UseInquiryCreateParams {
  onCreated?: () => void;
  successMessage?: string;
}

export const useInquiryCreate = ({
  onCreated,
  successMessage,
}: UseInquiryCreateParams = {}) => {
  const [submitErrorMessage, setSubmitErrorMessage] = useState("");
  const [submitSuccessMessage, setSubmitSuccessMessage] = useState("");

  const form = useForm<InquiryFormValues>({
    resolver: zodResolver(inquiryFormSchema),
    defaultValues: initialInquiryFormValues,
    mode: "onChange",
  });

  const createInquiryMutation = useMutation({
    mutationFn: sowaApi.public.createInquiry,
    onSuccess: () => {
      setSubmitErrorMessage("");
      setSubmitSuccessMessage(successMessage ?? "");
      form.reset(initialInquiryFormValues);
      onCreated?.();
    },
    onError: (error) => {
      setSubmitSuccessMessage("");
      setSubmitErrorMessage(parseErrorMessage(error));
    },
  });

  const onSubmitValues = (values: InquiryFormValues) => {
    setSubmitErrorMessage("");
    setSubmitSuccessMessage("");
    createInquiryMutation.mutate({
      name: values.name.trim(),
      phone: values.phone.trim(),
      age: values.age || undefined,
      interior_type: values.interiorType || undefined,
      area: values.area.trim() || undefined,
      move_in_date: values.moveInDate || undefined,
      desired_budget: values.desiredBudget.trim() || undefined,
      construction_start_date: values.constructionStartDate || undefined,
      referral_source: values.referralSource || undefined,
      referral_source_other:
        values.referralSource === "other"
          ? values.referralSourceOther.trim() || undefined
          : undefined,
      work_request: values.workRequest.trim() || undefined,
      content: values.content.trim() || undefined,
    });
  };

  return {
    form,
    onSubmitValues,
    submitErrorMessage,
    submitSuccessMessage,
    setSubmitErrorMessage,
    setSubmitSuccessMessage,
    isSubmitting: createInquiryMutation.isPending,
  };
};
