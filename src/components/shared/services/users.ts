import { User } from "@/generated/prisma/client";
import { axiosInstance } from "./instance";
import { ApiRoutes } from "./constants";

export const getUsers = async (): Promise<User[]> => {
  return (await axiosInstance.get<User[]>(ApiRoutes.GET_USERS)).data;
};