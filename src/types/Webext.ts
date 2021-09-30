interface NotificationButton {
  title: string;
  iconUrl?: string;
}

interface NotificationItem {
  title: string;
  message: string;
}

export interface SendNotificationParams {
  id?: string;
  title?: string;
  message: string;
  contextMessage?: string;
  type?: string;
  imageUrl?: string;
  iconUrl?: string;
  buttons?: NotificationButton[];
  items?: NotificationItem[];
}
