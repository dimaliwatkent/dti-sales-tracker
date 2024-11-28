import { apiSlice } from "../apiSlice";

export const eventApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEventList: builder.query({
      query: () => "/event/",
    }),

    getArchivedEvents: builder.query({
      query: () => "/event?isArchived=true",
    }),

    getUserEventList: builder.query({
      query: (userId) => `/event/user/${userId}`,
    }),

    getMonitorEventList: builder.query({
      query: () => `/event/monitor`,
    }),

    getEvent: builder.query({
      query: (id) => `/event/${id}`,
    }),

    addEvent: builder.mutation({
      query: (event) => ({
        url: "/event/",
        method: "POST",
        body: { ...event },
      }),
    }),

    editEvent: builder.mutation({
      query: ({ id, event }) => ({
        url: `/event/${id}`,
        method: "PUT",
        body: { ...event },
      }),
    }),

    archiveEvent: builder.mutation({
      query: (props) => ({
        url: `/event/${props.id}`,
        method: "PATCH",
        body: { ...props },
      }),
    }),
  }),
});

export const {
  useGetEventListQuery,
  useGetArchivedEventsQuery,
  useGetUserEventListQuery,
  useGetMonitorEventListQuery,
  useGetEventQuery,
  useAddEventMutation,
  useEditEventMutation,
  useArchiveEventMutation,
} = eventApiSlice;
