export interface NotificationData {
  firstName: string;
  lastName: string;
  message: string;
  city: string;
  orderNumber: number;
  timeStamp: number;
}

export interface NotificationsResponse {
  notifications: NotificationData[];
}

export interface SubmitButtonProps {
  onSubmitAction: () => Promise<void>;
  idleText?: string;
  successText?: string;
  className?: string;
}
