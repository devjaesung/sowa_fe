export const parseErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const maybeResponse = (
      error as { response?: { data?: { detail?: string }; status?: number } }
    ).response;

    if (maybeResponse?.status === 403) {
      return "비밀번호가 일치하지 않습니다.";
    }

    if (maybeResponse?.status === 404) {
      return "대상을 찾을 수 없습니다.";
    }

    if (typeof maybeResponse?.data?.detail === "string") {
      return maybeResponse.data.detail;
    }
  }

  return "요청 처리 중 오류가 발생했습니다.";
};
