import { Video, ChannelFilterOperator } from 'types';

export const parseVideoField = (video: Video, field: string) => {
  const parsed = video[field as keyof Video];
  switch (field) {
    case 'duration': {
      const minutes = (parsed as string).split(':')[0];
      return +minutes;
    }
    default:
      return parsed;
  }
};

export const evaluateField = (
  field: string | number,
  operator: ChannelFilterOperator,
  value: string | number
) => {
  switch (operator) {
    default:
    case ChannelFilterOperator.Equal:
      return field === value;
    case ChannelFilterOperator.NotEqual:
      return field !== value;
    case ChannelFilterOperator.GreatherThan:
      return field > value;
    case ChannelFilterOperator.GreatherThanOrEqual:
      return field >= value;
    case ChannelFilterOperator.LowerThan:
      return field < value;
    case ChannelFilterOperator.LowerThanOrEqual:
      return field <= value;
    case ChannelFilterOperator.Contains:
      return (field as string).includes(value as string);
    case ChannelFilterOperator.NotContains:
      return !(field as string).includes(value as string);
    case ChannelFilterOperator.StartsWith:
      return (field as string).startsWith(value as string);
    case ChannelFilterOperator.EndsWith:
      return (field as string).endsWith(value as string);
  }
};
