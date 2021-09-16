import MuiTab, { TabProps } from '@mui/material/Tab';

export default function Tab(props: TabProps) {
  return (
    <MuiTab
      sx={{
        fontSize: '0.975rem',
        fontWeight: 400,
        minWidth: 140,
        textTransform: 'capitalize',
      }}
      disableRipple
      {...props}
    />
  );
}
