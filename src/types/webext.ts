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

type Context = 'page' | 'link' | 'selection' | 'audio' | 'bookmark' | 'all';

type ContextType = 'normal' | 'checkbox' | 'radio' | 'separator';

export interface ContextMenu {
  title: string;
  id: string;
  type?: ContextType;
  enabled?: boolean;
  checked?: boolean;
  contexts: Context[];
}

export interface Tab {
  id: number;
  url: string;
}

export type TabResolver = (tab: Tab) => boolean;

export interface OpenTabOptions {
  reloadIfExists?: boolean;
  resolver?: TabResolver;
}
