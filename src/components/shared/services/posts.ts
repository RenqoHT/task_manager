import { Post } from "@/generated/prisma/client";
import { axiosInstance } from "./instance";
import { ApiRoutes } from "./constants";

export const search = async (query: string): Promise<Post[]> => {
  return (await axiosInstance.get<Post[]>(ApiRoutes.SEARCH_POSTS, { params: { query } }))
    .data;
};
