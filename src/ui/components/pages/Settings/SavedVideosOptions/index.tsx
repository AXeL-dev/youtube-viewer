import React, { useState, useRef } from 'react';
import {
  Button,
  ButtonGroup,
  ButtonTypeMap,
  ClickAwayListener,
  Grow,
  MenuItem,
  Paper,
  Popper,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClearVideosData, * as clearVideosOption from './ClearVideosData';
import ExportVideosData, * as exportVideosOption from './ExportVideosData';
import ImportVideosData, * as importVideosOption from './ImportVideosData';
import { StyledMenuList } from 'ui/components/shared/StyledMenu/StyledMenuList';
import { VideoCache } from 'types';

interface ISavedVideosOptionsProps {
  videos: VideoCache[];
}

const options = [
  {
    id: exportVideosOption.id,
    icon: exportVideosOption.icon,
    label: exportVideosOption.label,
    color: exportVideosOption.color,
  },
  {
    id: importVideosOption.id,
    icon: importVideosOption.icon,
    label: importVideosOption.label,
    color: importVideosOption.color,
  },
  {
    id: clearVideosOption.id,
    icon: clearVideosOption.icon,
    label: clearVideosOption.label,
    color: clearVideosOption.color,
  },
];

function SavedVideosOptions(props: ISavedVideosOptionsProps) {
  const { videos } = props;
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const color = options[selectedIndex].color as ButtonTypeMap['props']['color'];

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  const renderButton = () => {
    switch (options[selectedIndex].id) {
      case clearVideosOption.id:
        return <ClearVideosData />;
      case exportVideosOption.id:
        return <ExportVideosData videos={videos} />;
      case importVideosOption.id:
        return <ImportVideosData />;
      default:
        return null;
    }
  };

  return (
    <>
      <ButtonGroup
        variant="contained"
        color={color}
        ref={anchorRef}
        aria-label="split button"
      >
        {renderButton()}
        <Button
          size="small"
          sx={{ maxWidth: '40px' }}
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select an option"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-end"
        transition
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <StyledMenuList id="split-button-menu" autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={index}
                      selected={index === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {option.icon}
                      {option.label}
                    </MenuItem>
                  ))}
                </StyledMenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}

export default SavedVideosOptions;
