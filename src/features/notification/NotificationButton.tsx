import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotificationListData, useUserData } from "@/hooks/dataHooks";
import { Notification as NotificationType } from "@/types/NotificationType";
import useDataLoader from "@/hooks/useDataLoader";
import Refresh from "@/components/Refresh";
import { formatNotificationTime } from "@/utils/formatTime";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setNotification } from "@/api/notification/notificationSlice";
import { useMarkAsReadMutation } from "@/api/notification/notificationApiSlice";
import { Spinner } from "@/components/ui/spinner";

export default function NotificationButton() {
  const notificationList = useNotificationListData();
  const { isLoading, refetchNotificationList } = useDataLoader();
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [hasUnread, setHasUnread] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const role = useUserData().role;

  const [markAsRead] = useMarkAsReadMutation();

  useEffect(() => {
    if (notificationList) {
      const sortedNotifications = [...notificationList].sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
      setNotifications(sortedNotifications);
      setHasUnread(notificationList.some((notification) => !notification.read));
    }
  }, [notificationList]);

  const handleNotificationClick = async (notification: NotificationType) => {
    try {
      await markAsRead(notification._id).unwrap();
      await refetchNotificationList();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
    switch (role) {
      case "admin":
        navigate("/admin/notification/view-notification");
        break;
      case "monitor":
        navigate("/monitor/notification/view-notification");
        break;
      default:
        navigate("/notification/view-notification");
    }
    dispatch(setNotification(notification));
  };

  if (isLoading) {
    return (
      <div>
        <Spinner show={isLoading} />
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative">
          <Bell size={20} />
          {hasUnread && (
            <div className="absolute -top-2 -right-2 aspect-square h-3 rounded-full bg-red-500"></div>
          )}
          {notifications.length > 0 && !hasUnread && (
            <div className="absolute -top-2 -right-2 aspect-square h-3 rounded-full bg-gray-500"></div>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-2">
          <div className="flex items-center justify-between pb-4">
            <p className="font-bold">Notifications</p>
            <Refresh refetch={refetchNotificationList} icon />
          </div>
          <div className="flex flex-col gap-1">
            {notifications.length === 0 ? (
              <DropdownMenuItem>No new notifications</DropdownMenuItem>
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification._id}
                  className={`flex flex-col items-start border-b ${!notification.read ? "font-bold" : ""}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <span>{notification.title}</span>
                  <span className="text-sm text-gray-500">
                    {formatNotificationTime(notification.createdAt)}
                  </span>
                </DropdownMenuItem>
              ))
            )}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
