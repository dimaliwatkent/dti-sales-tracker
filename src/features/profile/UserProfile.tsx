import { roleMap } from "@/constants";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone } from "lucide-react";
import { User } from "@/types/UserType";

interface ProfileSectionProps {
  value: string | number | JSX.Element;
  icon: JSX.Element;
}

interface UserProfileProps {
  user: User;
}

const ProfileSection = ({ value, icon }: ProfileSectionProps) => {
  return (
    <div className="flex items-center gap-2 m-1">
      <div>{icon}</div>
      <div>{value}</div>
    </div>
  );
};

const UserProfile = ({ user }: UserProfileProps) => {
  return (
    <div className="user-profile border rounded-lg p-6 w-full">
      <div className="profile-pic flex justify-center">
        {user?.picture ? (
          <div className="aspect-square h-40 rounded-full overflow-hidden">
            <img
              src={user?.picture}
              alt="profile-picture"
              className="object-cover h-full w-full"
            />
          </div>
        ) : (
          <div className="aspect-square h-40 bg-secondary rounded-full" />
        )}
      </div>
      <div className="flex flex-col items-center mt-4">
        <p className="font-bold">{user.name}</p>

        <div className="bg-gray-200 dark:bg-gray-800 px-2 rounded-full my-2">
          <p className="text-sm">{roleMap[user.role] || "Unknown Role"}</p>
        </div>

        <Separator className="my-4" />
      </div>

      <ProfileSection value={user.email} icon={<Mail size={16} />} />
      <ProfileSection
        value={`0${user.phoneNumber}`}
        icon={<Phone size={16} />}
      />
    </div>
  );
};

export default UserProfile;