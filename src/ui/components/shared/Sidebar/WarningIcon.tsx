import { styled, keyframes } from '@mui/material/styles';
import WarningIcon from '@mui/icons-material/Warning';

const blink = keyframes`
  0%, 50%, 100% {
    opacity: 1;
  }
  25%, 75% {
    opacity: 0;
  }
`;

const Icon = styled(WarningIcon)`
  animation: ${blink} 2s infinite both;
`;

Icon.defaultProps = { color: 'warning' };

export default Icon;
