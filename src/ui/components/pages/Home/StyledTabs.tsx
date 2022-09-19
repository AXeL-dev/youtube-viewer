import { styled } from '@mui/material/styles';
import Tabs, { TabsProps } from '@mui/material/Tabs';

const StyledTabs = styled((props: TabsProps) => <Tabs {...props} />)(
  ({ theme }) => ({
    flexGrow: 1,
    '& .MuiTabs-flexContainer': {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(0.5),
    },
  }),
);

export default StyledTabs;
