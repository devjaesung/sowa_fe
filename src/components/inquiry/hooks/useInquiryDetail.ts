import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import type { InquiryDetail } from "../../../api/types";
import { sowaApi } from "../../../api/sowaApi";
import { parseErrorMessage } from "../../../shared/error";

export const useInquiryDetail = () => {
  const [selectedInquiryId, setSelectedInquiryId] = useState<number | null>(null);
  const [detailPassword, setDetailPassword] = useState("");
  const [detailErrorMessage, setDetailErrorMessage] = useState("");
  const [inquiryDetails, setInquiryDetails] = useState<Record<number, InquiryDetail>>({});
  const [passwordRequiredByInquiryId, setPasswordRequiredByInquiryId] = useState<Record<number, boolean>>({});

  const verifyInquiryMutation = useMutation({
    mutationFn: ({ id, password }: { id: number; password?: string }) =>
      password?.trim()
        ? sowaApi.public.verifyInquiry(id, { password: password.trim() })
        : sowaApi.public.verifyInquiry(id),
    onSuccess: (data) => {
      setInquiryDetails((prev) => ({ ...prev, [data.id]: data }));
      setPasswordRequiredByInquiryId((prev) => ({ ...prev, [data.id]: false }));
      setDetailErrorMessage("");
    },
    onError: (error, variables) => {
      const status =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { status?: number } }).response?.status === "number"
          ? (error as { response: { status: number } }).response.status
          : undefined;

      if (!variables.password) {
        setPasswordRequiredByInquiryId((prev) => ({ ...prev, [variables.id]: true }));
        setDetailErrorMessage("");
        return;
      }

      setPasswordRequiredByInquiryId((prev) => ({ ...prev, [variables.id]: true }));
      if (status === 403) {
        setDetailErrorMessage(parseErrorMessage(error));
        return;
      }
      setDetailErrorMessage("");
    },
  });

  const resetDetailPanel = () => {
    setSelectedInquiryId(null);
    setDetailPassword("");
    setDetailErrorMessage("");
  };

  const onSelectDetail = (id: number) => {
    if (selectedInquiryId === id) {
      resetDetailPanel();
      return;
    }

    setSelectedInquiryId(id);
    setDetailPassword("");
    setDetailErrorMessage("");

    if (inquiryDetails[id]) {
      setPasswordRequiredByInquiryId((prev) => ({ ...prev, [id]: false }));
      return;
    }

    setPasswordRequiredByInquiryId((prev) => ({ ...prev, [id]: false }));
    verifyInquiryMutation.mutate({ id });
  };

  const onVerifyDetail = (id: number, password: string) => {
    if (!password.trim()) {
      setDetailErrorMessage("비밀번호를 입력해주세요.");
      return;
    }

    setDetailErrorMessage("");
    verifyInquiryMutation.mutate({ id, password });
  };

  const selectedDetail = selectedInquiryId ? inquiryDetails[selectedInquiryId] : null;
  const isPasswordRequired = selectedInquiryId
    ? Boolean(passwordRequiredByInquiryId[selectedInquiryId])
    : false;

  return {
    selectedInquiryId,
    selectedDetail,
    detailPassword,
    detailErrorMessage,
    isPasswordRequired,
    isDetailLoading: verifyInquiryMutation.isPending,
    onSelectDetail,
    onDetailPasswordChange: setDetailPassword,
    onVerifyDetail,
    onCloseDetail: resetDetailPanel,
    onResetForListChange: resetDetailPanel,
  };
};

