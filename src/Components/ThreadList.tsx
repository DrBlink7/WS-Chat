import { FC } from "react";
import Scrollbar from "react-perfect-scrollbar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import FiberNewOutlinedIcon from "@mui/icons-material/FiberNewOutlined";
import Thread from "./Thread";

type ThreadListProps = {
  activeThread: string;
  threads: Record<string, Thread>;
  startNewThread: () => void;
  changeActiveThread: (id: string) => void;
  editThisThread: (id: string) => void;
  showDeleteConfirmation: (id: string) => void;
};

const ThreadList: FC<ThreadListProps> = ({
  activeThread,
  threads,
  changeActiveThread,
  editThisThread,
  showDeleteConfirmation,
  startNewThread,
}) => (
  <Scrollbar style={{ maxHeight: "90vh", width: "100%" }}>
    <List>
      <ListItemButton
        key={0}
        onClick={startNewThread}
        sx={{
          backgroundColor: !activeThread ? "#e0e0e0" : "transparent",
        }}
      >
        <ListItem>
          <ListItemText primary={`Start new Thread`} />
        </ListItem>
        <ListItemIcon>
          <FiberNewOutlinedIcon />
        </ListItemIcon>
        <Divider />
      </ListItemButton>
      {Object.entries(threads).map(([id, thread]) => (
        <Thread
          key={`Thread ${id}`}
          id={id}
          activeThread={activeThread}
          thread={thread}
          changeActiveThread={changeActiveThread}
          editThisThread={editThisThread}
          showDeleteConfirmation={showDeleteConfirmation}
        />
      ))}
    </List>
  </Scrollbar>
);

export default ThreadList;
