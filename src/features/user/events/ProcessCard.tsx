import React from "react";
import { Check } from "lucide-react";

interface ProcessCardProps {
  currentStep: number;
}
const ProcessCard = ({ currentStep }: ProcessCardProps) => {
  const steps = ["Apply", "Wait for Review", "Wait to Start"];

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center mb-8">
        {steps.map((_, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <div
                className={`line w-20 h-1 ${
                  currentStep >= index
                    ? "bg-[hsl(var(--chart-1))]"
                    : "bg-secondary"
                }`}
              />
            )}
            <div
              className={`circle w-6 h-6 flex items-center justify-center rounded-full ${
                currentStep >= index
                  ? "bg-[hsl(var(--chart-1))]"
                  : "bg-secondary"
              }`}
            >
              {currentStep > index ? (
                <div>
                  <Check size={14} />
                </div>
              ) : (
                <div>
                  <span className="text-lg">{index + 1}</span>
                </div>
              )}

              <div className="absolute translate-y-7">
                <p className="text-xs">{steps[index]}</p>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProcessCard;
