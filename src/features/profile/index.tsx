import ProfileUpload from "./ProfileUpload";
import { useUserData } from "@/hooks/dataHooks";
import UserProfile from "./UserProfile";
import ProfileRemove from "./ProfileRemove";

const Profile = () => {
  const user = useUserData();

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full md:w-[500px]">
        <UserProfile user={user} />
      </div>
      <div className=" flex gap-2">
        <ProfileUpload user={user} />
        <ProfileRemove user={user} />
      </div>
    </div>
  );
};

export default Profile;
