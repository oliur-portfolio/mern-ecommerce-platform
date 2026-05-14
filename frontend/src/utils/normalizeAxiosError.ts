export const normalizeAxiosError = (error: any) => {
  return new Error(
    error?.response?.data?.message || "Something went wrong. Please try again.",
  );
};
