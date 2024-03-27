import { FC, MouseEvent } from "react";
import Menu from "@mui/material/Menu";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import Divider from "@mui/material/Divider";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SendToMobileOutlinedIcon from "@mui/icons-material/SendToMobileOutlined";
import CustomAvatar from "./CustomAvatar";
import * as obj from "../Utils/obj";

const RightHeader: FC<{
  isThreadSelected: boolean;
  threads: Record<string, Thread>;
  activeThread: string;
  open: boolean;
  anchorEl: HTMLElement | null;
  fakeUser: User;
  handleClick: (event: MouseEvent<HTMLElement>) => void;
  handleClose: () => void;
  fakeDelete: () => Promise<void>;
  fakeEdit: () => Promise<void>;
  fakeSend: () => Promise<void>;
}> = ({
  activeThread,
  anchorEl,
  fakeUser,
  isThreadSelected,
  open,
  threads,
  fakeDelete,
  fakeEdit,
  fakeSend,
  handleClick,
  handleClose,
}) => (
  <Stack
    display="flex"
    width="75%"
    flexDirection="row"
    alignItems="center"
    justifyContent="space-between"
    p={1}
  >
    <Typography variant="body2" color="text.primary" fontSize="large">
      {isThreadSelected
        ? `${obj.get<Thread>(threads, activeThread).title}`
        : `Select a thread from the left side menu`}
    </Typography>
    {isThreadSelected && (
      <Box>
        <Button
          startIcon={<PersonOutlinedIcon />}
          id="customized-button"
          aria-controls={open ? "customized-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          variant="contained"
          disableElevation
          onClick={handleClick}
          endIcon={<KeyboardArrowDownIcon />}
        >
          Fake User
        </Button>
        <Menu
          id="customized-menu"
          MenuListProps={{
            "aria-labelledby": "customized-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          elevation={0}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          slotProps={{
            paper: {
              style: {
                borderRadius: 6,
                marginTop: 1,
                minWidth: 180,
                color: "rgb(55, 65, 81)",
                boxShadow:
                  "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
              },
            },
          }}
        >
          <MenuItem
            disableRipple
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <CustomAvatar
              firstName={fakeUser.firstName}
              lastName={fakeUser.lastName}
              bgcolor="secondary.main"
            />
            <Typography variant="body2" color="text.secondary">
              Hi {obj.get<Thread>(threads, activeThread).title}!
            </Typography>
          </MenuItem>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem onClick={fakeSend} disableRipple>
            <SendToMobileOutlinedIcon />
            Send a fake message
          </MenuItem>
          <MenuItem onClick={fakeEdit} disableRipple>
            <EditIcon />
            Edit last message
          </MenuItem>
          <MenuItem onClick={fakeDelete} disableRipple>
            <DeleteForeverOutlinedIcon />
            Delete last message
          </MenuItem>
        </Menu>
      </Box>
    )}
  </Stack>
);

export default RightHeader;
