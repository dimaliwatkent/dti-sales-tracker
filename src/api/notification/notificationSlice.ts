import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store.ts";
import { Notification } from "@/types/NotificationType.ts";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notificationList: [] as Notification[],
    notification: {} as Notification,
  },
  reducers: {
    setNotificationList: (state, action) => {
      state.notificationList = action.payload;
    },

    setNotification: (state, action) => {
      state.notification = action.payload;
    },

    clearNotication: (state) => {
      state.notificationList = [] as Notification[];
      state.notification = {} as Notification;
    },
  },
});

export const { setNotificationList, setNotification, clearNotication } =
  notificationSlice.actions;

export default notificationSlice.reducer;

export const selectNotificationList = (state: RootState) =>
  state.notification.notificationList;
export const selectNotification = (state: RootState) =>
  state.notification.notification;
