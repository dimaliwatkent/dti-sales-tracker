import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGetBusinessListQuery } from "@/api/business/businessApiSlice";
import {
  useGetEventListQuery,
  useGetMonitorEventListQuery,
  useGetUserEventListQuery,
} from "@/api/event/eventApiSlice";
import { useGetUserListQuery, useGetUserQuery } from "@/api/user/userApiSlice";
import { setBusinessList } from "@/api/business/businessSlice";
import {
  setEventList,
  setMonitorEventList,
  setOpenEventList,
  setUserEventList,
} from "@/api/event/eventSlice";
import { setUser, setUserList } from "@/api/user/userSlice";

import { User } from "@/types/UserType";
import { selectCurrentUser } from "@/api/auth/authSlice";
import { useSelector } from "react-redux";
import { useGetRecordSaleQuery } from "@/api/sale/saleApiSlice";
import { setRecordList } from "@/api/sale/saleSlice";
import { setNotificationList } from "@/api/notification/notificationSlice";
import { useGetNotificationsQuery } from "@/api/notification/notificationApiSlice";
import useInterval from "./useInterval";
import { intervalTime } from "@/constants";
import { useGetProductListQuery } from "@/api/product/productApiSlice";
import { setProductList } from "@/api/product/productSlice";

const useDataLoader = () => {
  const user: User = useSelector(selectCurrentUser);
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

  // get user events
  const {
    data: userEventList,
    isLoading: isUserEventListLoading,
    refetch: refetchUserEventList,
  } = useGetUserEventListQuery(user?._id, {
    skip: role !== "user",
  });

  const {
    data: monitorEventList,
    isLoading: isMonitorEventListLoading,
    refetch: refetchMonitorEventList,
  } = useGetMonitorEventListQuery(
    {},
    {
      skip: role !== "monitor",
    },
  );

  const {
    data: businessList,
    isLoading: isBusinessListLoading,
    refetch: refetchBusinessList,
  } = useGetBusinessListQuery(
    {},
    {
      // Only fetch business data when role is admin
      skip: role !== "admin",
    },
  );

  const {
    data: eventList,
    isLoading: isEventListLoading,
    refetch: refetchEventList,
  } = useGetEventListQuery(
    {},
    {
      skip: role !== "admin" && role !== "user",
    },
  );

  const {
    data: userList,
    isLoading: isUserListLoading,
    refetch: refetchUserList,
  } = useGetUserListQuery(
    {},
    {
      skip: role !== "admin",
    },
  );

  const {
    data: recordList,
    isLoading: isRecordListLoading,
    refetch: refetchRecordList,
  } = useGetRecordSaleQuery(
    {},
    {
      skip: role !== "admin",
    },
  );

  const {
    data: notificationList,
    isLoading: isNotificationListLoading,
    refetch: refetchNotificationList,
  } = useGetNotificationsQuery(user._id, {
    skip: !user,
  });

  const {
    data: productList,
    isLoading: isProductListLoading,
    refetch: refetchProductList,
  } = useGetProductListQuery(user._id, {
    skip: role !== "user",
  });

  const isLoading =
    isUserDataLoading ||
    isUserEventListLoading ||
    isBusinessListLoading ||
    isEventListLoading ||
    isUserListLoading ||
    isRecordListLoading ||
    isMonitorEventListLoading ||
    isNotificationListLoading ||
    isProductListLoading;

  const refetchAll = async () => {
    await Promise.all([
      refetchBusinessList(),
      refetchEventList(),
      refetchUserList(),
    ]);
  };

  // needed to be in their own individual useEffect to rerender on refetch
  useEffect(() => {
    if (userData) {
      dispatch(setUser(userData.user));
    }
  }, [userData, dispatch]);

  useEffect(() => {
    if (userEventList && role === "user") {
      dispatch(setOpenEventList(userEventList.openEventList));
      dispatch(setUserEventList(userEventList.userEventList));
    }
  }, [userEventList, role, dispatch]);

  useEffect(() => {
    if (businessList && role === "admin") {
      dispatch(setBusinessList(businessList.business));
    }
  }, [businessList, role, dispatch]);

  useEffect(() => {
    if (eventList && (role === "admin" || role === "user")) {
      dispatch(setEventList(eventList.event));
    }
  }, [eventList, role, dispatch]);

  useEffect(() => {
    if (userList && role === "admin") {
      dispatch(setUserList(userList.user));
    }
  }, [userList, role, dispatch]);

  useEffect(() => {
    if (recordList && role === "admin") {
      dispatch(setRecordList(recordList.record));
    }
  }, [recordList, role, dispatch]);

  useEffect(() => {
    if (monitorEventList && role === "monitor") {
      dispatch(setMonitorEventList(monitorEventList.eventList));
    }
  }, [monitorEventList, role, dispatch]);

  useEffect(() => {
    if (notificationList && user) {
      dispatch(setNotificationList(notificationList.notificationList));
    }
  }, [notificationList, role, dispatch]);

  useEffect(() => {
    if (productList && role === "user") {
      dispatch(setProductList(productList.customProduct));
    }
  }, [notificationList, role, dispatch]);

  useInterval(() => {
    refetchNotificationList();
    console.log("notification interval refetch");
  }, intervalTime.notification);

  return {
    isLoading,
    refetchAll,
    userData,
    refetchUserData,
    userEventList,
    refetchUserEventList,
    businessList,
    refetchBusinessList,
    eventList,
    refetchEventList,
    userList,
    refetchUserList,
    recordList,
    refetchRecordList,
    monitorEventList,
    refetchMonitorEventList,
    notificationList,
    refetchNotificationList,
    productList,
    refetchProductList,
  };
};

export default useDataLoader;
