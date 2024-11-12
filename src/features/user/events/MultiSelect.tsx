import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MultiSelectProps {
  title: string;
  options: string[];
  selectedItem: string[];
  setSelectedItem: (selectedItem: string[]) => void;
}

export function MultiSelect({
  title,
  options,
  selectedItem,
  setSelectedItem,
}: MultiSelectProps) {
  const [otherValue, setOtherValue] = useState("");
  const [isOtherEnabled, setIsOtherEnabled] = useState(false);

  const handleItemCheckedChange = (item: string, checked: boolean) => {
    if (checked) {
      setSelectedItem([...selectedItem, item]);
    } else {
      setSelectedItem(selectedItem.filter((i) => i !== item));
    }
  };

  const handleOtherClick = () => {
    setIsOtherEnabled(true);
  };

  const handleOtherValueChange = (value: string) => {
    setOtherValue(value);
  };

  const handleOtherValueSubmit = () => {
    if (otherValue !== "") {
      setSelectedItem([...selectedItem, otherValue]);
      setOtherValue("");
      setIsOtherEnabled(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="border rounded-sm py-2 px-3 text-sm">{title}</div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96">
        <DropdownMenuLabel>Select all that apply</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((option, index) => (
          <DropdownMenuCheckboxItem
            key={index}
            checked={selectedItem.includes(option)}
            onCheckedChange={(checked) =>
              handleItemCheckedChange(option, checked)
            }
          >
            {option}
          </DropdownMenuCheckboxItem>
        ))}
        <div className="flex items-center px-8 gap-2">
          <div className="text-sm" onClick={handleOtherClick}>
            Other:
          </div>
          {isOtherEnabled && (
            <div className="flex items-center gap-2">
              <Input
                value={otherValue}
                onChange={(e) => handleOtherValueChange(e.target.value)}
                placeholder="Enter other value"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleOtherValueSubmit();
                  }
                }}
              />
              <Button onClick={handleOtherValueSubmit}>Add</Button>
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
