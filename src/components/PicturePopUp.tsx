import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface PicturePopUpProps {
  picture: string;
}
const PicturePopUp = ({ picture }: PicturePopUpProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div onClick={() => setOpen(true)} className="relative group">
            <img
              src={picture}
              className="aspect-square h-20 object-cover rounded-lg"
            />
            <div
              className="absolute top-0 left-0 w-full h-full bg-black opacity-0 group-hover:opacity-50 
               transition duration-300"
            />
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
               text-lg text-white opacity-0 group-hover:opacity-100
               transition duration-300"
            >
              View
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <img
            src={picture}
            className="aspect-square h-full object-cover rounded-lg"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PicturePopUp;
