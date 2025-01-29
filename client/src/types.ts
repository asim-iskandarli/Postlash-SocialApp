export type UserType = {
  id: string;
  username: string;
  fullname: string;
  email: string;
  avatar?: string;
  biography?: string;
  birthday?: string | null;
  posts: PostType[];
  password: string;
  confirmPassword: string;
  followings: FollowType[];
  _count: {
    posts: number;
    followers: number;
    followings: number;
  };
};

export type FollowType = {
  followerId: string;
};

export type SignupType = {
  username: string;
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type SigninType = {
  email: string;
  password: string;
};

export type PostType = {
  id: string;
  content: string;
  user: UserType;
  media?: string[];
  likes: LikeType[];
  bookmarks: BookmarkType[];
  createdAt: Date;
  updatedAt: Date;
  _count: {
    comments: number;
    likes: number;
  };
};

export type LikeType = {
  id?: string;
  userId: string;
  user?: UserType;
  postId?: string;
  post?: PostType;
  createdAt?: Date;
};

export type BookmarkType = {
  id?: string;
  userId: string;
  user?: UserType;
  postId?: string;
  post?: PostType;
  createdAt?: Date;
};

export type MessageType = {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  receiver: UserType;
  sender: UserType;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type MessagesDataType = {
  user: UserType | null;
  messages: MessageType[];
};

export type NotificationType = {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  type: "LIKE" | "FOLLOW";
  post?: PostType;
  sender: UserType;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CommentType = {
  id: string;
  content: string;
  userId: string;
  user: UserType;
  postId: string;
  post: PostType;
  createdAt: Date;
};

export type StoryType = {
  id: string;
  media: string;
  userId: string;
  user: UserType;
  expiresAt: Date;
  createdAt: Date;
};
