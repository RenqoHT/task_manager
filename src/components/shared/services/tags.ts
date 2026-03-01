import { Tag } from "@/generated/prisma/client";
import { axiosInstance } from "./instance";
import { ApiRoutes } from "./constants";

export const getTags = async (): Promise<Tag[]> => {
  return (await axiosInstance.get<Tag[]>(ApiRoutes.GET_TAGS)).data;
};

export const searchTags = async (query: string): Promise<Tag[]> => {
  return (await axiosInstance.get<Tag[]>(ApiRoutes.SEARCH_TAGS, { params: { query } })).data;
};

export const createTag = async (name: string, color: string): Promise<Tag> => {
  return (await axiosInstance.post<Tag>(ApiRoutes.GET_TAGS, { name, color })).data;
};
