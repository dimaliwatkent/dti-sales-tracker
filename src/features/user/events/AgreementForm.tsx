import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

interface AgreementFormProps {
  agreed: boolean;
  setAgreed: (agreed: boolean) => void;
}

const AgreementForm = ({ agreed, setAgreed }: AgreementFormProps) => {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    setOpen(false);
  };
  const handleAgreementChange = () => {
    setAgreed(!agreed);
  };

  return (
    <div className="">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-full my-2">View Registration Agreement</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>EXPO TRACK REGISTRATION AGREEMENT</DialogTitle>
          </DialogHeader>
          <ScrollArea className="w-full h-[calc(100vh-200px)]  overflow-y-auto p-4 ">
            <div className="space-y-2">
              <p>
                Thank you for your interest in registering your business on Expo
                Track, the official mobile application of the Department of
                Trade and Industry Marinduque. By registering, you agree to the
                terms and conditions outlined below.
              </p>
              <p className="text-lg font-bold my-4">DATA PRIVACY AND CONSENT</p>
              <p>
                I hereby agree and give my consent to the collection and
                processing of my personal data, as provided through this
                registration form, for the database, physical/online trade
                fairs, and business matching events of the Provincial Government
                of Marinduque.
              </p>
              <p>
                I understand that my personal and company information will be
                shared with buyers and other DTI offices for the purpose of
                report preparation; the use of which shall be governed by the
                Data Privacy Act of 2012 and related laws and issuances. This
                consent shall be valid for one year unless otherwise revoked in
                writing.
              </p>

              <p className="text-lg font-bold my-4">WAIVER OF CLAIMS</p>
              <p>
                I, the undersigned, voluntarily waive all claims against loss or
                damage of any of our equipment, accessories, and other materials
                displayed or shared through Expo Track, in connection with any
                events or activities facilitated by the application.
              </p>
              <p>
                The Department of Trade and Industry Marinduque, represented by
                the Provincial Government of Marinduque, is free from any
                liabilities that may arise now and in the future.
              </p>
              <p className="text-lg font-bold my-4">ACCURACY OF INFORMATION</p>
              <p>
                I signify that I have read and understood the terms and
                conditions of this agreement, and I am ready to fully comply
                with the same. I certify that the information provided is true
                and correct based on my personal knowledge.
              </p>
              <p className="text-lg font-bold my-4">CONTACT INFORMATION</p>
              <p>
                For any questions or concerns about this agreement or the Expo
                Track application, please contact the Department of Trade and
                Industry Marinduque through:
              </p>
              <p>
                <span className="font-bold">Phone:</span>{" "}
                <span className="text-blue-500">
                  042-332-1750 & 042-754-0086
                </span>
              </p>
              <p>
                <span className="font-bold">Email:</span>{" "}
                <span className="text-blue-500">
                  r04b.marinduque@dti.gov.ph
                </span>
              </p>
              <p className="pt-6">
                By checking the box below, I acknowledge that I have read,
                understood, and agreed to the terms and conditions of this
                agreement.
              </p>
            </div>

            <div
              className="flex items-center gap-2 pt-2"
              onClick={handleAgreementChange}
            >
              <Checkbox checked={agreed} />
              <p className="font-bold">I AGREE TO THE TERMS AND CONDITIONS</p>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button type="button" onClick={handleConfirm} disabled={!agreed}>
              Agree
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgreementForm;