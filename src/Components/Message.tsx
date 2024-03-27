import { FC } from "react";
import { formatDate } from "../Utils/f";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import SmsFailedIcon from "@mui/icons-material/SmsFailed";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import SmsFailedOutlinedIcon from "@mui/icons-material/SmsFailedOutlined";

type MessageProps = {
  id: string;
  message: Message;
  user: User;
  handleReSendMessage: (id: string) => Promise<() => void>;
  editThisMessage: (id: string) => void;
  showDeleteConfirmation: (id: string) => void;
};

const Message: FC<MessageProps> = ({
  editThisMessage,
  handleReSendMessage,
  showDeleteConfirmation,
  id,
  message,
  user,
}) => (
  <ListItem
    key={id}
    sx={{
      display: "flex",
      justifyContent: message.userId === user.id ? "flex-end" : "flex-start",
    }}
  >
    {message.userId === user.id && message.status === "failed" && (
      <IconButton onClick={() => handleReSendMessage(id)}>
        <ReplayOutlinedIcon
          sx={{
            color: "white",
          }}
        />
      </IconButton>
    )}
    {message.deletedAt ? (
      <Box
        bgcolor="#a0a0a0"
        color="white"
        p={2}
        borderRadius={8}
        boxShadow={1}
        width="60%"
      >
        <Typography>Message Deleted</Typography>
        <Box display="flex" alignItems="center">
          <>
            <SmsFailedIcon color="error" />
            <Typography variant="caption">
              Deleted at: {formatDate(message.deletedAt)}
            </Typography>
          </>
        </Box>
      </Box>
    ) : (
      <Box
        bgcolor={message.userId === user.id ? "primary.main" : "secondary.main"}
        color="white"
        p={2}
        borderRadius={8}
        boxShadow={1}
        width="60%"
      >
        <Typography>
          {message.userId === user.id ? user.displayName : message.displayName}:{" "}
          {message.text}
        </Typography>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          {message.createdAt !== message.updatedAt ? (
            <Box display="flex" alignItems="center">
              <Box>
                <CheckOutlinedIcon
                  sx={{
                    color: "lightgreen",
                    fontSize: "medium",
                  }}
                />
                <EditOutlinedIcon
                  sx={{
                    fontSize: "medium",
                    color: "lightgreen",
                    marginRight: "1vh",
                  }}
                />
              </Box>
              <Typography variant="caption">
                Updated at: {formatDate(message.updatedAt)}
              </Typography>
            </Box>
          ) : (
            <Box display="flex" alignItems="center">
              {message.status === "sent" ? (
                <DoneAllIcon
                  sx={{
                    color: "lightgreen",
                    marginRight: "1vh",
                    fontSize: "medium",
                  }}
                />
              ) : message.status === "failed" ? (
                <SmsFailedOutlinedIcon
                  color="error"
                  sx={{
                    marginRight: "1vh",
                    fontSize: "medium",
                  }}
                />
              ) : null}
              <Typography variant="caption">
                {formatDate(message.createdAt)}
              </Typography>
            </Box>
          )}
          {message.userId === user.id && (
            <Box display="flex" justifyContent="space-between">
              <IconButton onClick={() => editThisMessage(id)}>
                <EditOutlinedIcon
                  sx={{
                    color: "white",
                  }}
                />
              </IconButton>
              <IconButton onClick={() => showDeleteConfirmation(id)}>
                <DeleteForeverOutlinedIcon
                  sx={{
                    color: "white",
                  }}
                />
              </IconButton>
            </Box>
          )}
        </Box>
      </Box>
    )}
  </ListItem>
);

export default Message;
