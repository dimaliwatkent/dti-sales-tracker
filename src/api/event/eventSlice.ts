import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store.ts";
import { EventType } from "@/types/EventType.ts";

const eventSlice = createSlice({
  name: "event",
  initialState: {
    event: {} as EventType,
  },
  reducers: {
    setEvent: (state, action) => {
      state.event = action.payload;
    },

    clearEventList: (state) => {
      state.event = {} as EventType;
    },
  },
});

export const { setEvent, clearEventList } = eventSlice.actions;

export default eventSlice.reducer;

export const selectEvent = (state: RootState) => state.event.event;
