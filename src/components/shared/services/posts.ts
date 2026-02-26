import { Post, User } from "@/generated/prisma/client";
import { axiosInstance } from "./instance";
import { ApiRoutes } from "./constants";

export const search = async (query: string): Promise<Post[]> => {
  return (await axiosInstance.get<Post[]>(ApiRoutes.SEARCH_POSTS, { params: { query } })).data;
};

export const getUsers = async (): Promise<User[]> => {
  return (await axiosInstance.get<User[]>(ApiRoutes.GET_USERS)).data;
};

export type PostCreationData = Omit<Post, 
  'post_id' | 
  'post_date' | 
  'post_done_link_mini_video_smm' |
  'post_done_link_video' |
  'post_done_link_text' |
  'post_done_link_photogallery' |
  'post_done_link_cover_photo' |
  'post_done_link_photo_cards' |
  'post_done_link_mini_gallery' |
  'post_status' |
  'is_published' |
  'feedback_comment' |
  'approved_by_id' |
  'post_feedback_mini_video_smm' |
  'post_feedback_video' |
  'post_feedback_text' |
  'post_feedback_photogallery' |
  'post_feedback_cover_photo' |
  'post_feedback_photo_cards' |
  'post_feedback_mini_gallery'
>;

export type PostUpdateData = Partial<Omit<Post, 'post_id' | 'post_date'>>;

export const create = async (postData: PostCreationData): Promise<Post> => {
  return (await axiosInstance.post<Post>(ApiRoutes.CREATE_POST, postData)).data;
};

export const update = async (id: number, postData: PostUpdateData): Promise<Post> => {
  return (await axiosInstance.put<Post>(`${ApiRoutes.UPDATE_POST}/${id}`, postData)).data;
};
