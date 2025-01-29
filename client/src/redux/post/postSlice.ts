import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PostType } from "../../types";

export interface IPost {
  posts: PostType[];
}

const initialState: IPost = {
  posts: [],
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    getPosts: (state: IPost, action: PayloadAction<PostType[]>) => {
      state.posts = action.payload;
    },
    addPost: (state: IPost, action: PayloadAction<PostType>) => {
      state.posts = [action.payload, ...state.posts];
    },
    updatePost: (state: IPost, action: PayloadAction<PostType>) => {
      state.posts = [
        ...state.posts.map((p: PostType) =>
          p.id === action.payload.id ? action.payload : p
        ),
      ];
    },
    postDelete: (state: IPost, action: PayloadAction<string>) => {
      state.posts = [
        ...state.posts.filter((post: PostType) => post.id !== action.payload),
      ];
    },
  },
});

export const { getPosts, updatePost, addPost, postDelete } = postSlice.actions;

export default postSlice.reducer;
