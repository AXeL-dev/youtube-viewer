export interface Channel {
  id: string;
  thumbnail: string;
  title: string;
  url: string;
  description: string;
  isHidden?: boolean;
  notifications?: ChannelNotifications;
  filters?: ChannelFilter[];
}

export enum ChannelFilterOperator {
  Equal = '=',
  NotEqual = '!=',
  GreatherThan = '>',
  GreatherThanOrEqual = '>=',
  LowerThan = '<',
  LowerThanOrEqual = '<=',
  Contains = 'contains',
  NotContains = 'notContains',
  StartsWith = 'startsWith',
  EndsWith = 'endsWith',
}

export interface ChannelFilter {
  field: string;
  operator: ChannelFilterOperator;
  value: string | number;
}

export interface ChannelNotifications {
  isDisabled: boolean;
}

export interface ChannelActivities {
  videoId: string;
}
