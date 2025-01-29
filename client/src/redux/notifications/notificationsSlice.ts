import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NotificationType } from "../../types";

interface INotifications {
  notifications: NotificationType[];
}

const initialState: INotifications = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setNotifications: (
      state: INotifications,
      action: PayloadAction<NotificationType[]>
    ) => {
      state.notifications = action.payload;
    },
    addNotifications: (
      state: INotifications,
      action: PayloadAction<NotificationType>
    ) => {
      state.notifications = [action.payload, ...state.notifications];
    },
  },
});

export const { setNotifications, addNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
