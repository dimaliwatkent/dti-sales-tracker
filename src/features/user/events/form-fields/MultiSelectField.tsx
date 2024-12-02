import { X } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MultiSelect } from "../MultiSelect";

interface MultiSelectFieldProps {
  name: string;
  label: string;
  options: string[];
  form: any;
}

const MultiSelectField = ({
  name,
  label,
  options,
  form,
}: MultiSelectFieldProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>

          <div className="flex flex-wrap gap-2">
            {field.value.length > 0
              ? field.value.map((item: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-full px-3 bg-[hsl(var(--chart-1))]"
                    onClick={() => {
                      field.onChange(
                        field.value.filter((i: string) => i !== item),
                      );
                    }}
                  >
                    {item} <X size={10} />
                  </div>
                ))
              : ""}
          </div>
          <MultiSelect
            title={`Select ${label}`}
            options={options}
            selectedItem={field.value}
            setSelectedItem={field.onChange}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default MultiSelectField;
