/**
 * Interface for notification data
 */

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  severity: string;
  read: boolean;
  createdAt: Date;
}
