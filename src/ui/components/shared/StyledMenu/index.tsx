import { styled, alpha } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';

export const StyledMenu = styled((props: MenuProps) => (
  <Menu
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    MenuListProps={{
      dense: true,
    }}
    {...props}
  />
))(({ theme, style }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: style?.minWidth || 180,
    color:
      theme.palette.mode === 'light'
        ? 'rgb(55, 65, 81)'
        : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        marginRight: theme.spacing(1.5),
        '&:not(.inherit-color)': {
          color: theme.palette.text.secondary,
        },
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.action.selected,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));
