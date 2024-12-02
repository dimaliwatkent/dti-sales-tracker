import { selectMonitorEvent } from "@/api/event/eventSlice";
import { useDispatch, useSelector } from "react-redux";

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { setMonitorBusiness } from "@/api/business/businessSlice";
import { BusinessWithViolation } from "@/types/BusinessType";

const MonitorViewEvent = () => {
  const event = useSelector(selectMonitorEvent);
  const businessList = event.businessList;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleBusinessClick = (business: BusinessWithViolation) => {
    dispatch(setMonitorBusiness(business));
    navigate("/monitor/events/view-business");
  };

  return (
    <div>
      <p className="text-3xl font-bold my-6">{event.title}</p>
      <div>
        <ScrollArea className="w-full h-[calc(100vh-230px)] md:h-[calc(100vh-150px)]">
          {businessList && businessList.length > 0 ? (
            businessList.map((business) => (
              <div key={business._id}>
                <Card
                  className="p-6 space-y-3"
                  onClick={() => handleBusinessClick(business)}
                >
                  <p>{business.name}</p>
                </Card>
              </div>
            ))
          ) : (
            <div>Currently no business</div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default MonitorViewEvent;
