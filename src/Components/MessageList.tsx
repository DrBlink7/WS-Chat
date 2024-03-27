import { FC, MutableRefObject } from "react";
import Scrollbar from "react-perfect-scrollbar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Message from "./Message";

type MessageListProps = {
  scrollbarRef: MutableRefObject<HTMLElement | null>;
  isThreadSelected: boolean;
  thereAreMessageToShow: number;
  messages: Record<string, Message>;
  user: User;
  handleReSendMessage: (id: string) => Promise<() => void>;
  editThisMessage: (id: string) => void;
  showDeleteConfirmation: (id: string) => void;
};

const MessageList: FC<MessageListProps> = ({
  editThisMessage,
  handleReSendMessage,
  showDeleteConfirmation,
  isThreadSelected,
  messages,
  scrollbarRef,
  thereAreMessageToShow,
  user,
}) => (
  <Scrollbar
    style={{
      maxHeight: "90vh",
      width: "100%",
      flexDirection: "column-reverse",
    }}
    containerRef={(ref) => (scrollbarRef.current = ref)}
  >
    <List sx={{ display: "flex", flexDirection: "column" }}>
      {isThreadSelected && thereAreMessageToShow
        ? Object.entries(messages).map(([id, message]) => (
            <Message
              key={`Message ${id}`}
              id={id}
              message={message}
              user={user}
              handleReSendMessage={handleReSendMessage}
              editThisMessage={editThisMessage}
              showDeleteConfirmation={showDeleteConfirmation}
            />
          ))
        : isThreadSelected && (
            <ListItem
              key={0}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box
                bgcolor="black"
                color="white"
                p={2}
                borderRadius={8}
                boxShadow={1}
                maxWidth="70%"
              >
                <Typography>No Messages</Typography>
              </Box>
            </ListItem>
          )}
    </List>
  </Scrollbar>
);

export default MessageList;
