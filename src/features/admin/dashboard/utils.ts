import { EventWithBusinessType } from "@/types/EventType";

export const getBusinessData = (
  selectedEvent: EventWithBusinessType | undefined,
) => {
  return [
    {
      name: "Approved",
      value: selectedEvent?.businessList.length,
      fill: "hsl(var(--chart-1))",
    },
    {
      name: "Applicant",
      value: selectedEvent?.businessCount.applicant,
      fill: "hsl(var(--chart-2))",
    },
    {
      name: "Rejected",
      value: selectedEvent?.businessCount.rejected,
      fill: "hsl(var(--chart-3))",
    },
  ];
};
