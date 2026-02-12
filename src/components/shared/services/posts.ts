import { Post, User } from "@/generated/prisma/client";
import { axiosInstance } from "./instance";
import { ApiRoutes } from "./constants";

export const search = async (query: string): Promise<Post[]> => {
  return (await axiosInstance.get<Post[]>(ApiRoutes.SEARCH_POSTS, { params: { query } }))
    .data;
};

export const getUsers = async (): Promise<User[]> => {
  return (await axiosInstance.get<User[]>(ApiRoutes.GET_USERS)).data;
};

export type PostCreationData = Omit<Post, 
  'post_id' | 
  'post_date' | 
  'post_status' |
  'post_done_link_video_smm' |
  'post_done_link_video_maker' |
  'post_done_link_text' |
  'post_done_link_photogallery' |
  'post_done_link_cover_photo' |
  'post_done_link_photo_cards'
>;

export type PostUpdateData = Partial<Omit<Post, 
  'post_id' | 
  'post_date'
>>;

export const create = async (postData: PostCreationData): Promise<Post> => {
  return (await axiosInstance.post<Post>(ApiRoutes.CREATE_POST, postData)).data;
};

export const update = async (id: number, postData: PostUpdateData): Promise<Post> => {
  return (await axiosInstance.put<Post>(`${ApiRoutes.UPDATE_POST}/${id}`, postData)).data;
};
