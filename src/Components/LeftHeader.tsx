import { FC } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LogoutIcon from "@mui/icons-material/Logout";
import CustomAvatar from "./CustomAvatar";

type LeftHeaderProps = {
  user: User;
  openDrawer: boolean;
  handleOpenDrawer: () => void;
  toggleDrawer: (open: boolean) => (event: KeyboardEvent | MouseEvent) => void;
  closeDrawer: () => void;
};

const LeftHeader: FC<LeftHeaderProps> = ({
  user: { email, firstName, lastName, displayName },
  openDrawer,
  handleOpenDrawer,
  toggleDrawer,
  closeDrawer,
}) => (
  <Stack
    display="flex"
    width="25%"
    flexDirection="row"
    justifyContent="space-between"
    alignItems="center"
    p={1}
  >
    <CustomAvatar
      firstName={firstName}
      lastName={lastName}
      openDrawer={handleOpenDrawer}
    />
    <Typography variant="body2" color="text.secondary">
      Hi {displayName}!
    </Typography>
    <Drawer anchor="left" open={openDrawer} onClose={toggleDrawer(false)}>
      <Box component="div" sx={{ width: 250 }} role="presentation">
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <CustomAvatar firstName={firstName} lastName={lastName} />
              </ListItemIcon>
              <ListItemText>{displayName}</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText>{email}</ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={closeDrawer}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText>Log Out</ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  </Stack>
);

export default LeftHeader;
