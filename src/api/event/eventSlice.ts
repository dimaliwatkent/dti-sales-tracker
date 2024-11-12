import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store.ts";
import { Event, EventBusiness } from "@/types/EventType.ts";

const eventSlice = createSlice({
  name: "event",
  initialState: {
    eventList: [] as Event[],
    event: {} as Event,
    // for user event
    openEventList: [] as Event[],
    userEventList: [] as EventBusiness[],
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
    setEvent: (state, action) => {
      state.event = action.payload;
    },

    clearEventList: (state) => {
      state.eventList = [] as Event[];
      state.event = {} as Event;
    },
  },
});

export const {
  setEventList,
  setOpenEventList,
  setUserEventList,
  setEvent,
  clearEventList,
} = eventSlice.actions;

export default eventSlice.reducer;

export const selectEventList = (state: RootState) => state.event.eventList;
export const selectOpenEventList = (state: RootState) => state.event.openEventList;
export const selectUserEventList = (state: RootState) => state.event.userEventList;

export const selectEvent = (state: RootState) => state.event.event;
