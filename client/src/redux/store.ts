import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import postReducer from "./post/postSlice";
import userSlice from "./user/userSlice";
import themeSlice from "./theme/themeSlice";
import messageSlice from "./message/messageSlice";
import notificationsSlice from "./notifications/notificationsSlice";
import storiesSlice from "./stories/storiesSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,
    user: userSlice,
    theme: themeSlice,
    message: messageSlice,
    notifications: notificationsSlice,
    stories: storiesSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
