import { formatDateTime } from "@/utils/formatTime";
import { eventStatusMap } from "@/constants";

import BusinessCard from "../business/BusinessCard";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useGetEventPopulatedQuery } from "@/api/event/eventApiSlice";
import { useEffect, useState } from "react";
import SpinnerText from "@/components/SpinnerWithText";
import Refresh from "@/components/Refresh";

import { BusinessType } from "@/types/BusinessType";
import { EventPopulatedType } from "@/types/EventType";

import { useParams } from "react-router-dom";

const ViewEvent = (): JSX.Element => {
  const { id } = useParams();

  const [event, setEvent] = useState<EventPopulatedType | undefined>(undefined);
  const [applicantList, setApplicantList] = useState<BusinessType[]>([]);
  const [forCompletionList, setForCompletionList] = useState<BusinessType[]>(
    [],
  );
  const [rejectedList, setRejectedList] = useState<BusinessType[]>([]);
  const [exhibitorList, setExhibitorList] = useState<BusinessType[]>([]);

  const {
    data: eventData,
    isLoading: isEventLoading,
    refetch: refetchEvent,
  } = useGetEventPopulatedQuery(id);

  useEffect(() => {
    if (eventData?.event) {
      setEvent(eventData?.event);

      if (eventData?.event.applicantList.length > 0) {
        const applicantListData = eventData?.event.applicantList;
        const applicants = applicantListData.filter(
          (business: BusinessType) => business.applicationStatus === "pending",
        );
        setApplicantList(applicants);

        const forCompletions = applicantListData.filter(
          (business: BusinessType) =>
            business.applicationStatus === "forcompletion" ||
            business.applicationStatus === "complied",
        );
        setForCompletionList(forCompletions);

        const rejected = applicantListData.filter(
          (business: BusinessType) => business.applicationStatus === "rejected",
        );
        setRejectedList(rejected);
      }

      if (eventData?.event.businessList.length > 0) {
        setExhibitorList(eventData?.event.businessList);
      }
    }
  }, [eventData]);

  const refetchEventData = async () => {
    await refetchEvent().unwrap();
  };

  if (isEventLoading) {
    return (
      <div>
        <SpinnerText spin={isEventLoading} />
      </div>
    );
  }

  return (
    <div>
      <p className="text-3xl font-bold my-6">{event?.title}</p>
      <div className="mb-4 space-y-3 rounded-lg border p-4">
        <div className="flex gap-2">
          <p className="font-bold">Duration</p>
          {formatDateTime(event?.startDate)} - {formatDateTime(event?.endDate)}
        </div>

        <div className="flex gap-2">
          <p className="font-bold">Application Duration</p>
          {formatDateTime(event?.applicationStart)} -{" "}
          {formatDateTime(event?.applicationEnd)}
        </div>
        <div className="flex gap-2">
          <p className="font-bold">Status</p>
          {eventStatusMap[event?.status || "none"]}
        </div>
        <div className="flex gap-2">
          <p className="font-bold">Location</p>
          {event?.location}
        </div>
        <div className="flex gap-2">
          <p className="font-bold">Location Type</p>
          {event?.isLocal ? "Local" : "Non-Local"}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xl font-bold mb-2" id="requirements">
          Requirements
        </p>

        <div className="space-y-3">
          {event?.documentList && event?.documentList.length > 0 ? (
            event?.documentList.map((doc, index) => (
              <div key={index}>
                {doc && (
                  <div className="flex justify-between items-center gap-2">
                    <p className="text-primary/70">{doc.filename}</p>
                    <div className="flex gap-2">
                      <div className="text-left bg-primary h-8 px-4 flex items-center justify-center rounded-lg hover:scale-105">
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <p className="text-background">View File</p>
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div>No added requirements.</div>
          )}
        </div>
      </div>

      <div>
        <p className="text-xl font-bold mb-2">Businesses</p>
        <Tabs
          defaultValue={event?.status === "ongoing" ? "approved" : "applicants"}
          className=""
        >
          <div className="flex">
            <TabsList>
              <TabsTrigger value="applicants">Applicants</TabsTrigger>
              <TabsTrigger value="forcompletion">For Completion</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>

            <Refresh refetch={refetchEventData} className="ml-2" />
          </div>

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
            {!exhibitorList || exhibitorList.length === 0 ? (
              <p>No exhibitors</p>
            ) : (
              exhibitorList.map((business) => (
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
