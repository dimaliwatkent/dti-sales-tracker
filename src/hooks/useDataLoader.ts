import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGetBusinessListQuery } from "@/api/business/businessApiSlice";
import {
  useGetEventListQuery,
  useGetUserEventListQuery,
} from "@/api/event/eventApiSlice";
import { useGetUserListQuery, useGetUserQuery } from "@/api/user/userApiSlice";
import { setBusinessList } from "@/api/business/businessSlice";
import {
  setEventList,
  setOpenEventList,
  setUserEventList,
} from "@/api/event/eventSlice";
import { setUser, setUserList } from "@/api/user/userSlice";

import { User } from "@/types/UserType";
import { selectCurrentUser } from "@/api/auth/authSlice";
import { useSelector } from "react-redux";
import { useGetRecordSaleQuery } from "@/api/sale/saleApiSlice";
import { setRecordList } from "@/api/sale/saleSlice";

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

  const isLoading =
    isUserDataLoading ||
    isUserEventListLoading ||
    isBusinessListLoading ||
    isEventListLoading ||
    isUserListLoading ||
    isRecordListLoading;

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
  };
};

export default useDataLoader;
