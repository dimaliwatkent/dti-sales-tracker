import React, { useState } from "react";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BoothType } from "@/types/BoothType";

interface BoothFormProps {
  booths: BoothType[];
  setBooths: (booths: BoothType[]) => void;
}

const BoothForm: React.FC<BoothFormProps> = ({ booths, setBooths }) => {
  const [codes, setCodes] = useState("");
  const business = "";

  const handleAddBooth = (newBooths: BoothType[]) => {
    setBooths([...booths, ...newBooths]);
  };

  const handleAddBooths = () => {
    const boothCodes = codes.split("\n").filter((code) => code.trim() !== "");
    const newBooths: BoothType[] = boothCodes
      .map((code) => ({
        code,
        business,
      }))
      .filter(
        (newBooth) => !booths.some((booths) => booths.code === newBooth.code),
      );

    handleAddBooth(newBooths);
    setCodes("");
  };

  return (
    <div className="p-4  rounded-lg border w-1/2 space-y-4">
      <h2 className="text-lg font-bold mb-2">Add Booths</h2>
      <Textarea
        className="h-48"
        value={codes}
        onChange={(e) => setCodes(e.target.value)}
        placeholder={`Enter booth codes, one per line\nExample:\n\nA1-1\nA1-2\nA1-3`}
      />

      <Button className="" onClick={handleAddBooths}>
        Add Booths
      </Button>
    </div>
  );
};

export default BoothForm;
