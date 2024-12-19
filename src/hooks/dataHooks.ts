// Get data from Redux slice

import { useSelector } from "react-redux";

import { selectUser } from "@/api/user/userSlice";
import { Notification } from "@/types/NotificationType";
import { selectNotificationList } from "@/api/notification/notificationSlice";
import { UserType } from "@/types/UserType";

const useUserData = () => {
  const user: UserType = useSelector(selectUser);
  return user;
};

const useNotificationListData = () => {
  const notificationList: Notification[] = useSelector(selectNotificationList);
  return notificationList;
};

export { useUserData, useNotificationListData };
