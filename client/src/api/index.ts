import axios from "axios";
import { SigninType, SignupType } from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api`
    : "http://localhost:5000/api",
  withCredentials: true,
});

export default api;

// Auth
export const fetchSignup = async (userData: SignupType) => {
  const res = await api.post("/auth/signup", userData);
  return res.data;
};

export const fetchSignin = async (userData: SigninType) => {
  const res = await api.post("/auth/signin", userData);
  return res.data;
};

// User
export const getProfile = async (username: string) => {
  const res = await api.get(`/user/user/${username}`);
  return res.data.user;
};

export const getNewUsers = async () => {
  const res = await api.get("/user/newusers");
  return res.data.users;
};

export const fetchRefreshUser = async () => {
  const res = await api.post("/auth/refreshUser");
  return res.data;
};

export const fetchUpdateProfile = async ({
  userId,
  userData,
}: {
  userId: string;
  userData: any;
}) => {
  const res = await api.post(`/user/${userId}/update`, userData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const getUserFollows = async (
  userId: string,
  type: "followers" | "followings"
) => {
  const res = await api.get(`/user/${userId}/${type}`);
  return res.data;
};

// Post
export const fetchPosts = async () => {
  const res = await api.get("/posts");
  return res.data.getPosts;
};

export const createPost = async (data: FormData) => {
  const res = await api.post("/posts/create", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const toggleLike = async (postId: string) => {
  const res = await api.post(`/posts/${postId}/like`);
  return res.data;
};

export const deletePost = async (postId: string) => {
  const res = await api.delete(`/posts/${postId}`);
  return res.data;
};

// Notifications
export const getNotifications = async (userId: string) => {
  const res = await api.get(`/notifications/${userId}`);
  return res.data;
};

export const markNotificationsAsRead = async () => {
  await api.post("/notifications/markAsRead");
};

export const deleteNotifications = async () => {
  await api.delete("/notifications");
};

// Comments
export const createCommentToPost = async (data: any) => {
  const res = await api.post(`/posts/${data.postId}/comments`, data);
  return res.data;
};

export const getComments = async (postId: string) => {
  const res = await api.get(`/posts/${postId}/comments`);
  return res.data;
};

// Messages
export const createMessage = async (data: any) => {
  const res = await api.post("/messages/create", data);
  return res.data;
};

export const getMessages = async (userId: string) => {
  const res = await api.get(`/messages/${userId}`);
  return res.data;
};

export const getLatestMessages = async () => {
  const res = await api.get("/messages/conversations");
  return res.data;
};

// Bookmark
export const toggleBookmark = async (postId: string) => {
  console.log(postId);
  const res = await api.post(`/posts/${postId}/bookmark`);
  return res.data;
};

export const getBookmarks = async () => {
  const res = await api.get(`/user/bookmarks`);
  return res.data;
};

// Story
export const createStory = async (data: FormData) => {
  const res = await api.post("/stories/create", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const getStories = async () => {
  const res = await api.get("/stories");
  return res.data;
};
