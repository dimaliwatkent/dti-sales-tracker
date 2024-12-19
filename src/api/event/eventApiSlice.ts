import { apiSlice } from "../apiSlice";

export const eventApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEventByStatus: builder.query({
      query: (status) => `/event/status/${status}`,
    }),

    getEventWithBusiness: builder.query({
      query: (eventId) => `/event/business/${eventId}`,
    }),

    getEventList: builder.query({
      query: () => "/event/",
    }),

    getUserEventList: builder.query({
      query: (userId) => `/event/user/${userId}`,
    }),

    getEventPopulated: builder.query({
      query: (id) => `/event/populated/${id}`,
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
  useGetEventByStatusQuery,
  useGetEventWithBusinessQuery,
  useGetEventListQuery,
  useGetUserEventListQuery,
  useGetEventPopulatedQuery,
  useGetEventQuery,
  useAddEventMutation,
  useEditEventMutation,
  useArchiveEventMutation,
} = eventApiSlice;
