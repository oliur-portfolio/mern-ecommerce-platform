import axiosPrivate from "./axios";

export const getAdminDashboardStats = async () => {
  const res = await axiosPrivate.get("/dashboard/stats");
  return res.data;
};
