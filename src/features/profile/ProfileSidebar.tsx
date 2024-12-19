import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import SignOut from "@/features/auth/SignOut";
import { useUserData } from "@/hooks/dataHooks";
import { ModeToggle } from "@/components/mode-toggle";

const ProfileSidebar = () => {
  const user = useUserData();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <div>
          <Menu />
        </div>
      </SheetTrigger>
      <SheetContent>
        <div className="flex flex-col justify-between h-full pt-10">
          <div>
            <div className="flex gap-4 items-center">
              <div className="bg-secondary w-16 h-16 rounded-xl"></div>
              <div>
                <p className="text-xl font-bold">{user?.businessName}</p>
                <p>{user?.name}</p>
              </div>
            </div>
            <Separator className="my-6" />

            <ModeToggle />
          </div>

          <div className="">{user?._id && <SignOut id={user._id} />}</div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProfileSidebar;
