import { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FileFieldProps {
  name: string;
  label: string;
  accept?: string;
  form: any;
  setPreviewUrl?: (url: string) => void;
}

const handleFileChange = (
  event: React.ChangeEvent<HTMLInputElement>,
  props: FileFieldProps,
) => {
  const file = event.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      props.form.setValue(props.name, base64String);
      if (props.setPreviewUrl) {
        props.setPreviewUrl(base64String);
      }
    };
    reader.readAsDataURL(file);
  }
};

const FileField = ({ name, label, accept, form }: FileFieldProps) => {
  const [previewUrl, setPreviewUrlState] = useState("");

  const handleFileChangeWrapper = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    handleFileChange(event, {
      name,
      label,
      accept,
      form,
      setPreviewUrl: setPreviewUrlState,
    });
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type="file"
              accept={accept}
              onChange={handleFileChangeWrapper}
              className="block w-full text-sm h-12
            file:mr-4 file:px-4 file:py-2
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-primary file:text-accent
            hover:file:bg-primary/50"
            />
          </FormControl>
          <FormMessage />
          {previewUrl && (
            <div className="mt-2">
              {accept === "image/*" ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-w-full h-auto max-h-64 rounded-lg"
                />
              ) : (
                <div className="text-left bg-primary h-8 w-32 flex items-center justify-center rounded-lg">
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <p className="text-background">View File</p>
                  </a>
                </div>
              )}
            </div>
          )}
        </FormItem>
      )}
    />
  );
};
export default FileField;
