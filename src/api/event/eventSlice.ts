import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store.ts";
import {
  Event,
  EventBusiness,
  EventBusinessMonitor,
} from "@/types/EventType.ts";

const eventSlice = createSlice({
  name: "event",
  initialState: {
    eventList: [] as Event[],
    event: {} as Event,
    // for user event
    openEventList: [] as Event[],
    userEventList: [] as EventBusiness[],
    // for monitor event
    monitorEventList: [] as EventBusinessMonitor[],
    monitorEvent: {} as EventBusinessMonitor,
  },
  reducers: {
    setEventList: (state, action) => {
      state.eventList = action.payload;
    },

    setOpenEventList: (state, action) => {
      state.openEventList = action.payload;
    },
    setUserEventList: (state, action) => {
      state.userEventList = action.payload;
    },

    setMonitorEventList: (state, action) => {
      state.monitorEventList = action.payload;
    },

    setMonitorEvent: (state, action) => {
      state.monitorEvent = action.payload;
    },

    setEvent: (state, action) => {
      state.event = action.payload;
    },

    clearEventList: (state) => {
      state.eventList = [] as Event[];
      state.event = {} as Event;
      state.userEventList = [] as EventBusiness[];
      state.monitorEventList = [] as EventBusinessMonitor[];
      state.monitorEvent = {} as EventBusinessMonitor;
    },
  },
});

export const {
  setEventList,
  setOpenEventList,
  setUserEventList,
  setMonitorEventList,
  setMonitorEvent,
  setEvent,
  clearEventList,
} = eventSlice.actions;

export default eventSlice.reducer;

export const selectEventList = (state: RootState) => state.event.eventList;
export const selectOpenEventList = (state: RootState) =>
  state.event.openEventList;
export const selectUserEventList = (state: RootState) =>
  state.event.userEventList;
export const selectMonitorEventList = (state: RootState) =>
  state.event.monitorEventList;

export const selectEvent = (state: RootState) => state.event.event;
export const selectMonitorEvent = (state: RootState) =>
  state.event.monitorEvent;
