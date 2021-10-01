import { styled } from '@mui/material/styles';
import MuiLinearProgress, {
  linearProgressClasses,
} from '@mui/material/LinearProgress';

const LinearProgress = styled(MuiLinearProgress)(({ theme }) => ({
  height: 3,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
  },
}));

export default LinearProgress;
