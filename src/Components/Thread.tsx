import { FC } from "react";
import { formatDate } from "../Utils/f";
import Stack from "@mui/material/Stack";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import ListItemButton from "@mui/material/ListItemButton";
import Box from "@mui/material/Box";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import IconButton from "@mui/material/IconButton";

type ThreadProps = {
  id: string;
  activeThread: string;
  thread: Thread;
  changeActiveThread: (id: string) => void;
  editThisThread: (id: string) => void;
  showDeleteConfirmation: (id: string) => void;
};

const Thread: FC<ThreadProps> = ({
  activeThread,
  id,
  thread,
  changeActiveThread,
  editThisThread,
  showDeleteConfirmation,
}) => (
  <Stack
    key={id}
    display="flex"
    flexDirection="column-reverse"
    sx={{
      backgroundColor: id === activeThread ? "#e0e0e0" : "transparent",
    }}
  >
    <ListItemButton
      key={id}
      onClick={() => changeActiveThread(id)}
      sx={{
        backgroundColor: id === activeThread ? "#e0e0e0" : "transparent",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <ListItemText
        secondary={`Last updated: ${formatDate(thread.updatedAt)}`}
        primary={thread.title}
      />
      <Box display="flex">
        <IconButton
          edge="end"
          onClick={(e) => {
            e.stopPropagation();

            return editThisThread(id);
          }}
        >
          <EditOutlinedIcon />
        </IconButton>
        <IconButton
          edge="end"
          onClick={(e) => {
            e.stopPropagation();

            return showDeleteConfirmation(id);
          }}
        >
          <DeleteForeverOutlinedIcon />
        </IconButton>
      </Box>
      <Divider />
    </ListItemButton>
  </Stack>
);

export default Thread;
