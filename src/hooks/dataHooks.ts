// Get data from Redux slice

import { useSelector } from "react-redux";

import {
  selectBusinessList,
  selectBusiness,
  selectActiveBusiness,
} from "@/api/business/businessSlice";

import { Business } from "@/types/BusinessType";
import { User } from "@/types/UserType";
import { Event, EventBusiness } from "@/types/EventType";

import {
  selectEvent,
  selectEventList,
  selectOpenEventList,
  selectUserEventList,
} from "@/api/event/eventSlice";
import { selectUser, selectUserList } from "@/api/user/userSlice";
import { selectRecordList } from "@/api/sale/saleSlice";
import { Record } from "@/types/RecordType";

const useBusinessListData = () => {
  const businessList: Business[] = useSelector(selectBusinessList);
  return businessList;
};

const useBusinessData = () => {
  const business: Business = useSelector(selectBusiness);
  return business;
};

const useActiveBusinessData = () => {
  const business = useSelector(selectActiveBusiness);
  return business;
};

const useUserData = () => {
  const user: User = useSelector(selectUser);
  return user;
};

const useUserListData = () => {
  const userListData: User[] | undefined = useSelector(selectUserList);
  return userListData;
};

const useEventListData = () => {
  const eventList: Event[] = useSelector(selectEventList);
  return eventList;
};

const useEventData = () => {
  const event: Event = useSelector(selectEvent);
  return event;
};

const useOpenEventListData = () => {
  const event: Event[] = useSelector(selectOpenEventList);
  return event;
};

const useUserEventListData = () => {
  const event: EventBusiness[] = useSelector(selectUserEventList);
  return event;
};

const useRecordListData = () => {
  const record: Record[] = useSelector(selectRecordList);
  return record;
};

export {
  useBusinessListData,
  useBusinessData,
  useActiveBusinessData,
  useUserData,
  useUserListData,
  useEventListData,
  useEventData,
  useOpenEventListData,
  useUserEventListData,
  useRecordListData,
};
