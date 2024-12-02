import { selectEvent, setEvent } from "@/api/event/eventSlice";
import { useDispatch, useSelector } from "react-redux";
import { formatDateTime } from "@/utils/formatTime";
import { eventStatusMap, intervalTime } from "@/constants";

import BusinessCard from "../business/BusinessCard";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import useInterval from "@/hooks/useInterval";
import { useGetEventQuery } from "@/api/event/eventApiSlice";
import { useState } from "react";
import SpinnerText from "@/components/SpinnerWithText";
import Refresh from "@/components/Refresh";

const ViewEvent = (): JSX.Element => {
  const event = useSelector(selectEvent);
  const [rerenderTrigger, setRerenderTrigger] = useState(0);

  const { isLoading, refetch } = useGetEventQuery(event._id);

  const dispatch = useDispatch();

  const applicants = event?.applicantList;
  const exhibitorsList = event?.businessList;

  const applicantList = applicants?.filter(
    (business) => business.applicationStatus === "pending",
  );
  const forCompletionList = applicants?.filter(
    (business) =>
      business.applicationStatus === "forcompletion" ||
      business.applicationStatus === "complied",
  );
  const rejectedList = applicants?.filter(
    (business) => business.applicationStatus === "rejected",
  );

  const refetchEvent = async () => {
    const result = await refetch().unwrap();
    dispatch(setEvent(result.event));
    setRerenderTrigger(rerenderTrigger + 1);
  };

  useInterval(() => {
    refetchEvent();
    console.log("interval refetch");
  }, intervalTime.adminViewEvent);

  if (isLoading) {
    return (
      <div>
        <SpinnerText spin={isLoading} />
      </div>
    );
  }

  return (
    <div>
      <p className="text-3xl font-bold my-6">{event.title}</p>
      <div className="mb-4 space-y-3 rounded-lg border p-4">
        <div className="flex gap-2">
          <p className="font-bold">Duration</p>
          {formatDateTime(event.startDate)} - {formatDateTime(event.endDate)}
        </div>

        <div className="flex gap-2">
          <p className="font-bold">Application Duration</p>
          {formatDateTime(event.applicationStart)} -{" "}
          {formatDateTime(event.applicationEnd)}
        </div>
        <div className="flex gap-2">
          <p className="font-bold">Status</p>
          {eventStatusMap[event.status]}
        </div>
        <div className="flex gap-2">
          <p className="font-bold">Location</p>
          {event.location}
        </div>
      </div>

      <div>
        <p className="text-xl font-bold mb-2">Businesses</p>
        <Tabs
          defaultValue={event.status === "ongoing" ? "approved" : "applicants"}
          className=""
        >
          <TabsList>
            <TabsTrigger value="applicants">Applicants</TabsTrigger>
            <TabsTrigger value="forcompletion">For Completion</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <Refresh refetch={refetchEvent} className="ml-2" />

          <TabsContent value="applicants">
            {!applicantList || applicantList.length === 0 ? (
              <p>No applicants</p>
            ) : (
              applicantList.map((business) => (
                <div key={business._id} className="mb-4">
                  <BusinessCard business={business} type={"applicant"} />
                </div>
              ))
            )}
          </TabsContent>
          <TabsContent value="forcompletion">
            {!forCompletionList || forCompletionList.length === 0 ? (
              <p>No businesses for completion</p>
            ) : (
              forCompletionList.map((business) => (
                <div key={business._id} className="mb-4">
                  <BusinessCard business={business} type={"forcompletion"} />
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="approved">
            {!exhibitorsList || exhibitorsList.length === 0 ? (
              <p>No exhibitors</p>
            ) : (
              exhibitorsList.map((business) => (
                <div key={business._id} className="mb-4">
                  <BusinessCard business={business} type={"approved"} />
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="rejected">
            {!rejectedList || rejectedList.length === 0 ? (
              <p>No rejected businesses </p>
            ) : (
              rejectedList.map((business) => (
                <div key={business._id}>
                  <BusinessCard business={business} type={"rejected"} />
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ViewEvent;
