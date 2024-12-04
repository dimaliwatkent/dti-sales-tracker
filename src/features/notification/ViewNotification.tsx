import { useEffect, useState } from "react";
import { useNotificationListData } from "@/hooks/dataHooks";

import { Card } from "@/components/ui/card";
import { formatNotificationTime } from "@/utils/formatTime";
import useDataLoader from "@/hooks/useDataLoader";
import { useMarkAsReadMutation } from "@/api/notification/notificationApiSlice";

import { Notification as NotificationType } from "@/types/NotificationType";
import SpinnerText from "@/components/SpinnerWithText";
import Refresh from "@/components/Refresh";
import { ScrollArea } from "@/components/ui/scroll-area";

const ViewNotification = () => {
  const notificationList = useNotificationListData();
  const { isLoading, refetchNotificationList } = useDataLoader();
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [markAsRead] = useMarkAsReadMutation();

  useEffect(() => {
    if (notificationList) {
      const sortedNotifications = [...notificationList].sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
      setNotifications(sortedNotifications);
    }
  }, [notificationList]);

  const handleNotificationClick = async (notification: NotificationType) => {
    try {
      await markAsRead(notification._id).unwrap();
      await refetchNotificationList();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  if (isLoading) {
    return (
      <div>
        <SpinnerText spin={isLoading} />
      </div>
    );
  }

  return (
    <div>
      <Card className="p-6">
        <div className="w-full flex justify-between pb-4">
          <p className="font-bold text-xl">All Notifications</p>
          <Refresh refetch={refetchNotificationList} />
        </div>
        <ScrollArea className="w-full h-[calc(100vh-230px)] md:h-[calc(100vh-180px)]">
        <div className="flex flex-col gap-4">
          {notifications.length === 0 ? (
            <div>No new notifications</div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`flex flex-col items-start ${!notification.read ? "bg-secondary" : ""} border rounded-lg p-4`}
                onClick={() => handleNotificationClick(notification)}
              >
                <p className="font-bold">{notification.title}</p>
                <p>{notification.message}</p>
                <p className="text-sm text-gray-500">
                  {formatNotificationTime(notification.createdAt)}
                </p>
              </div>
            ))
          )}
        </div>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default ViewNotification;
