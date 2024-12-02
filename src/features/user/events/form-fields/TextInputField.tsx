import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface TextInputFieldProps {
  name: string;
  label: string;
  type?: "text" | "date" | "number";
  placeholder?: string;
  description?: string;
  form: any;
}

const TextInputField = ({
  name,
  label,
  type = "text",
  placeholder,
  description,
  form,
}: TextInputFieldProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} placeholder={placeholder} {...field} />
          </FormControl>

          {description && (
            <FormDescription>{description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TextInputField;
