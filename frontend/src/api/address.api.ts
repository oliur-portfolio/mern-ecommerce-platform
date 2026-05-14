import axiosPrivate from "./axios";

export const getMyAddresses = async () => {
  const res = await axiosPrivate.get("/address");
  return res.data;
};
