import { User } from "@/types/UserType";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { setActiveUser } from "@/api/user/userSlice";
import { useDispatch } from "react-redux";
import { roleMap } from "@/constants";
import { Mail, Phone } from "lucide-react";

interface UserCardProps {
  user: User;
}

const UserCard = ({ user }: UserCardProps) => {
  const handleUserClick = (user: User) => {
    dispatch(setActiveUser(user));
  };

  const dispatch = useDispatch();

  return (
    <div>
      <Card
        className={`${user.isArchived ? "opacity-30" : ""} p-6`}
        onClick={() => handleUserClick(user)}
      >
        <div className="flex flex-col items-center ">
          <div className="aspect-square h-20 bg-secondary rounded-full" />
          <p className="font-bold text-lg">{user.name}</p>

          <p className="text-primary/70 text-sm">
            {roleMap[user.role] || "Unknown Role"}
          </p>
        </div>

        <Separator className="my-2" />
        <div className="text-primary/70 break-all">
          <div className="flex items-center gap-2 pb-2 ">
            <Mail size={16} />
            <p className="text-sm">{user.email}</p>
          </div>

          <div className="flex items-center gap-2 pb-2">
            <Phone size={16} />
            <p className="text-sm">0{user.phoneNumber}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserCard;