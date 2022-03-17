import { ChannelFilterOperator } from 'types';

export enum FilterType {
  Text = 'text',
  Number = 'number',
}

interface FilterSettings {
  field: string;
  type: FilterType;
  operators: ChannelFilterOperator[];
}

export const settings: FilterSettings[] = [
  {
    field: 'title',
    type: FilterType.Text,
    operators: [
      ChannelFilterOperator.Equal,
      ChannelFilterOperator.NotEqual,
      ChannelFilterOperator.Contains,
      ChannelFilterOperator.NotContains,
      ChannelFilterOperator.StartsWith,
      ChannelFilterOperator.EndsWith,
    ],
  },
  {
    field: 'duration',
    type: FilterType.Number,
    operators: [
      ChannelFilterOperator.Equal,
      ChannelFilterOperator.NotEqual,
      ChannelFilterOperator.GreatherThan,
      ChannelFilterOperator.GreatherThanOrEqual,
      ChannelFilterOperator.LowerThan,
      ChannelFilterOperator.LowerThanOrEqual,
    ],
  },
  {
    field: 'publishedAt',
    type: FilterType.Number,
    operators: [
      ChannelFilterOperator.Equal,
      ChannelFilterOperator.NotEqual,
      ChannelFilterOperator.GreatherThan,
      ChannelFilterOperator.GreatherThanOrEqual,
      ChannelFilterOperator.LowerThan,
      ChannelFilterOperator.LowerThanOrEqual,
    ],
  },
];

export const settingsByField: { [key: string]: FilterSettings } =
  settings.reduce((acc, { field, ...rest }) => ({ ...acc, [field]: rest }), {});

export const fields = settings.map(({ field }) => field);
