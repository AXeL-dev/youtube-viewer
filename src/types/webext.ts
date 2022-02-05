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

export interface MessageRequest {
  message: string;
  params: any;
}

export interface BadgeColors {
  backgroundColor: string;
  textColor: string;
}

export interface Tab {
  id: string;
  url: string;
}

export interface OpenTabOptions {
  reloadIfExists?: boolean;
  resolver?: (tab: Tab) => boolean;
}
