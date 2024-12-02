import { setActiveBusiness } from "@/api/business/businessSlice";
import { Button } from "@/components/ui/button";
import { useEventData } from "@/hooks/dataHooks";
import { Business } from "@/types/BusinessType";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const EventViolation = () => {
  const event = useEventData();
  const businessList = event.businessList;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleViolationClick = (business: Business) => {
    navigate("/admin/management/violation/view-violation");
    dispatch(setActiveBusiness(business));
  };

  return (
    <div>
      <div>
        <p className="text-xl font-bold pb-6">Violators</p>
      </div>
      <div className="flex flex-col gap-4">
        {businessList && businessList.length > 0 ? (
          businessList.map((business) => (
            <div key={business._id} className="border p-6 rounded-lg">
              <div className="space-y-4">
                <p className="text-lg font-bold">{business.name}</p>
                <p className="">Booth Number: {business.boothNumber}</p>
                {business.violationList && (
                  <p className="">
                    Number of Violations: {business.violationList.length}
                  </p>
                )}
                <Button onClick={() => handleViolationClick(business)}>
                  Violations
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div>Currently no ongoing events</div>
        )}
      </div>
    </div>
  );
};

export default EventViolation;
