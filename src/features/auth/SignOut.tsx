import { useDispatch } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { useSignoutMutation } from "@/api/auth/authApiSlice";
import { signOut } from "@/api/auth/authSlice";
import { clearBusinessList } from "@/api/business/businessSlice";
import { clearEventList } from "@/api/event/eventSlice";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LogOut } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface SignOutProps {
  id: string;
}

const SignOut: React.FC<SignOutProps> = ({ id }) => {
  const [signout, { isLoading }] = useSignoutMutation();
  const { toast } = useToast();

  const dispatch = useDispatch();

  const handleclick = async () => {
    try {
      // Sign out mutation
      await signout(String(id));

      // Clear relevant data
      dispatch(signOut());
      dispatch(clearBusinessList());
      dispatch(clearEventList());

      // Redirect to sign in page
      window.location.href = "/signin";
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

  if (isLoading) {
    return (
      <div>
        <Spinner show={isLoading} />
      </div>
    );
  }

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <div className="flex items-center gap-6 py-6 md:py-2 ">
            <LogOut />
            <p className="block md:hidden text-lg">Log Out</p>
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign Out</AlertDialogTitle>
            <AlertDialogDescription>
              This will SIGN OUT your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleclick}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SignOut;
