import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PostType, UserType } from "../../types";

interface IUser {
  users: UserType[];
  activeUsers: UserType[];
  loading: boolean;
}

const initialState: IUser = {
  users: [],
  activeUsers: [],
  loading: false,
};

const userSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    getUser: (state: IUser, action: PayloadAction<UserType>) => {
      if (
        state.users.some(
          (u: UserType) => u.username === action.payload.username
        )
      )
        return;

      state.users = [...state.users, action.payload];
    },
    updateUserProfile: (state: IUser, action) => {
      const { biography, birthday, avatar, userId } = action.payload;
      state.users = [
        ...state.users.map((user: UserType) =>
          user.id === userId
            ? {
                ...user,
                biography,
                birthday,
                avatar: avatar ? avatar : user.avatar,
              }
            : user
        ),
      ];
      state.activeUsers = [
        ...state.activeUsers.map((user: UserType) =>
          user.id === userId
            ? {
                ...user,
                biography,
                birthday,
                avatar: avatar ? avatar : user.avatar,
              }
            : user
        ),
      ];
    },
    updateUserPost: (state: IUser, action: PayloadAction<PostType>) => {
      state.users = [
        ...state.users.map((user: UserType) =>
          user.id === action.payload.user.id
            ? {
                ...user,
                posts: [
                  ...user.posts.map((p: PostType) =>
                    p.id === action.payload.id ? action.payload : p
                  ),
                ],
              }
            : user
        ),
      ];
    },
    addPostUser: (state: IUser, action: PayloadAction<PostType>) => {
      state.users = [
        ...state.users.map((user: UserType) =>
          user.id === action.payload.user.id
            ? {
                ...user,
                posts: [action.payload, ...user.posts],
              }
            : user
        ),
      ];
    },
    userFollow: (state: IUser, action) => {
      state.users = [
        ...state.users.map((user: UserType) =>
          user.id === action.payload.userId
            ? {
                ...user,
                _count: {
                  ...user._count,
                  followers: user._count.followers + 1,
                },
              }
            : user.id === action.payload.currentId
            ? {
                ...user,
                _count: {
                  ...user._count,
                  followings: user._count.followings + 1,
                },
              }
            : user
        ),
      ];
    },
    userUnfollow: (state: IUser, action) => {
      state.users = [
        ...state.users.map((user: UserType) =>
          user.id === action.payload.userId
            ? {
                ...user,
                _count: {
                  ...user._count,
                  followers: user._count.followers - 1,
                },
              }
            : user.id === action.payload.currentId
            ? {
                ...user,
                _count: {
                  ...user._count,
                  followings: user._count.followings - 1,
                },
              }
            : user
        ),
      ];
    },
    setActiveUsers: (state: IUser, action) => {
      state.activeUsers = action.payload;
    },
  },
});
export const {
  updateUserPost,
  userFollow,
  userUnfollow,
  getUser,
  updateUserProfile,
  setActiveUsers,
  addPostUser,
} = userSlice.actions;
export default userSlice.reducer;
