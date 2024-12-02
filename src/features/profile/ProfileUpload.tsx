import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUploadProfileMutation } from "@/api/upload/uploadApiSlice";
import { useToast } from "@/components/ui/use-toast";
import useProcessImage from "@/hooks/useProcessImage";
import { User } from "@/types/UserType";
import useDataLoader from "@/hooks/useDataLoader";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ProfileUploadProps {
  user: User;
}

const ProfileUpload = ({ user }: ProfileUploadProps) => {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const processImage = useProcessImage();

  const { refetchUserData } = useDataLoader();

  const { toast } = useToast();
  const [uploadProfile, { isLoading }] = useUploadProfileMutation();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processImage(file, canvasRef, setSelectedImage);
    }
  };

  const handleUpload = async () => {
    try {
      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);
        formData.append("uploaderId", user._id);
        const result = await uploadProfile(formData).unwrap();
        toast({
          variant: "default",
          title: "Success",
          description: result.message,
        });

        setSelectedImage(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        refetchUserData();
        setOpen(false);
      }
    } catch (error: unknown) {
      if (error) {
        toast({
          variant: "destructive",
          title: (error as { data: { message: string } }).data.message,
          description: (error as { data: { err: string } }).data.err,
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="">Upload Profile Picture</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Picture</DialogTitle>
          <DialogDescription>
            Add or Change your profile picture
          </DialogDescription>
        </DialogHeader>

        <div className="">
          <div className="mb-4">
            <Input
              type="file"
              id="image-upload"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="block w-full text-sm h-12
            file:mr-4 file:px-4 file:py-2
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-primary file:text-accent
            hover:file:bg-primary/50"
            />
          </div>
          {selectedImage && (
            <div className="mb-4">
              <img
                src={selectedImage}
                alt="Selected"
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>

            <Button
              onClick={handleUpload}
              disabled={!selectedImage || isLoading}
            >
              {isLoading ? "Uploading..." : "Upload"}
            </Button>
          </div>
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileUpload;
