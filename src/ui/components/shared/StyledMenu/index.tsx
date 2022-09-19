import { styled, alpha } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import { Theme } from '@mui/system';

const parseValue = (value: any, theme: Theme) => {
  switch (typeof value) {
    case 'number':
      return theme.spacing(value);
    case 'string':
      return value;
    default:
      return 0;
  }
};

export const StyledMenu = styled((props: MenuProps) => (
  <Menu
    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    {...props}
    MenuListProps={{
      dense: true,
      ...props.MenuListProps,
    }}
  />
))(({ theme, style }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: parseValue(style?.marginTop, theme) ?? theme.spacing(1),
    marginLeft: parseValue(style?.marginLeft, theme) ?? 0,
    minWidth: style?.minWidth ?? 180,
    color:
      theme.palette.mode === 'light'
        ? 'rgb(55, 65, 81)'
        : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiListSubheader-root': {
      backgroundColor: 'inherit',
      lineHeight: '40px',
    },
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
