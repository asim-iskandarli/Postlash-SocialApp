import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FollowType, UserType } from "../../types";

export interface IAuth {
  user: null | UserType;
  loading: boolean;
}

const initialState: IAuth = {
  user: null,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state: IAuth, action: PayloadAction<UserType>) => {
      state.user = action.payload;
      state.loading = false;
    },
    updateProfile: (state: IAuth, action: PayloadAction<any>) => {
      console.log(action.payload);
      const { avatar, biography, birthday } = action.payload;
      if (state.user) {
        state.user = {
          ...state.user,
          avatar: avatar || state.user.avatar,
          biography,
          birthday,
        };
      }
    },
    logout: (state: IAuth) => {
      state.user = null;
    },
    setLoading: (state: IAuth, action) => {
      state.loading = action.payload;
    },
    follow: (state: IAuth, action) => {
      if (state.user) {
        state.user = {
          ...state.user,
          followings: [
            ...state.user.followings,
            { followerId: action.payload },
          ],
        };
      }
    },
    unfollow: (state: IAuth, action) => {
      if (state.user) {
        state.user = {
          ...state.user,
          followings: state.user.followings.filter(
            (follow: FollowType) => follow.followerId !== action.payload
          ),
        };
      }
    },
  },
});

export const { setUser, logout, follow, unfollow, setLoading, updateProfile } =
  authSlice.actions;
export default authSlice.reducer;
