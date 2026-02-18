import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
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
      queryClient.invalidateQueries({ queryKey: ["public-inquiry"] });
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
      password: values.password,
      age: values.age || undefined,
      interior_type: values.interiorType || undefined,
      area: values.area.trim() || undefined,
      move_in_date: values.moveInDate || undefined,
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
    isSubmitting: createInquiryMutation.isPending,
  };
};
