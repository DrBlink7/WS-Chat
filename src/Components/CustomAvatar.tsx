import { FC } from "react";
import { generateAvatarInitials } from "../Utils/f";
import Avatar from "@mui/material/Avatar";

type CustomAvatarProps = {
  firstName: string;
  lastName: string;
  bgcolor?: string;
  openDrawer?: () => void;
};

const CustomAvatar: FC<CustomAvatarProps> = ({
  firstName,
  lastName,
  bgcolor = "primary.main",
  openDrawer,
}) => (
  <Avatar onClick={openDrawer} sx={{ cursor: "pointer", bgcolor }}>
    {generateAvatarInitials(firstName, lastName)}
  </Avatar>
);

export default CustomAvatar;
