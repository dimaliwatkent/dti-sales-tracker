import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGetUserQuery } from "@/api/user/userApiSlice";
import { setUser } from "@/api/user/userSlice";

import { UserType } from "@/types/UserType";
import { selectCurrentUser } from "@/api/auth/authSlice";
import { useSelector } from "react-redux";
import { setNotificationList } from "@/api/notification/notificationSlice";
import { useGetNotificationsQuery } from "@/api/notification/notificationApiSlice";
import useInterval from "./useInterval";
import { intervalTime } from "@/constants";

const useDataLoader = () => {
  const user: UserType = useSelector(selectCurrentUser);
  const role = user.role;

  const dispatch = useDispatch();

  // get user data
  const {
    data: userData,
    isLoading: isUserDataLoading,
    refetch: refetchUserData,
  } = useGetUserQuery(user?._id, {
    skip: !user._id,
  });

  const {
    data: notificationList,
    isLoading: isNotificationListLoading,
    refetch: refetchNotificationList,
  } = useGetNotificationsQuery(user._id, {
    skip: !user,
  });

  // needed to be in their own individual useEffect to rerender on refetch
  useEffect(() => {
    if (userData) {
      dispatch(setUser(userData.user));
    }
  }, [userData, dispatch]);

  useEffect(() => {
    if (notificationList && user) {
      dispatch(setNotificationList(notificationList.notificationList));
    }
  }, [notificationList, role, dispatch]);

  useInterval(() => {
    refetchNotificationList();
    console.log("notification interval refetch");
  }, intervalTime.notification);

  return {
    userData,
    isUserDataLoading,
    refetchUserData,

    notificationList,
    isNotificationListLoading,
    refetchNotificationList,
  };
};

export default useDataLoader;
