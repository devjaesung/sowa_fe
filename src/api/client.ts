import axios from "axios";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

export const apiClient = axios.create({
  baseURL: rawBaseUrl || "",
  withCredentials: true,
});

export const toFormData = (payload: object): FormData => {
  const formData = new FormData();

  Object.entries(payload as Record<string, unknown>).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    if (value instanceof File) {
      formData.append(key, value);
      return;
    }

    formData.append(key, String(value));
  });

  return formData;
};
