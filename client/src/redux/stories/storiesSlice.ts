import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StoryType } from "../../types";

interface IStory {
  stories: StoryType[];
}

const initialState: IStory = {
  stories: [],
};

const storiesSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setStories: (state: IStory, action: PayloadAction<StoryType[]>) => {
      state.stories = action.payload;
    },
    addStory: (state: IStory, action: PayloadAction<StoryType>) => {
      if (
        state.stories.find(
          (story: StoryType) => story.user.id === action.payload.user.id
        )
      ) {
        state.stories = [
          ...state.stories.map((story) =>
            story.user.id === action.payload.user.id ? action.payload : story
          ),
        ];
      } else {
        state.stories = [action.payload, ...state.stories];
      }
    },
    deleteStory: (state: IStory, action: PayloadAction<StoryType>) => {
      state.stories = state.stories.filter(
        (story: StoryType) => story.id !== action.payload.id
      );
    },
  },
});

export const { setStories, addStory, deleteStory } = storiesSlice.actions;
export default storiesSlice.reducer;
