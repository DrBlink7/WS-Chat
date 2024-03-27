import { FC, MutableRefObject } from "react";
import {
  Control,
  Controller,
  SubmitHandler,
  UseFormHandleSubmit,
} from "react-hook-form";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import BgImage from "./BgImage";
import MessageList from "./MessageList";

type ChatPageProps = {
  scrollbarRef: MutableRefObject<HTMLElement | null>;
  isThreadSelected: boolean;
  thereAreMessageToShow: number;
  messages: Record<string, Message>;
  user: User;
  handleReSendMessage: (id: string) => Promise<() => void>;
  editThisMessage: (id: string) => void;
  showDeleteConfirmation: (id: string) => void;
  handleSubmit: UseFormHandleSubmit<ChatFormInputs>;
  onSubmitNewMessage: SubmitHandler<ChatFormInputs>;
  control: Control<ChatFormInputs>;
};

const ChatPage: FC<ChatPageProps> = ({
  control,
  isThreadSelected,
  messages,
  scrollbarRef,
  thereAreMessageToShow,
  user,
  handleSubmit,
  editThisMessage,
  onSubmitNewMessage,
  showDeleteConfirmation,
  handleReSendMessage,
}) => (
  <BgImage width="100%">
    <MessageList
      scrollbarRef={scrollbarRef}
      isThreadSelected={isThreadSelected}
      thereAreMessageToShow={thereAreMessageToShow}
      messages={messages}
      user={user}
      handleReSendMessage={handleReSendMessage}
      editThisMessage={editThisMessage}
      showDeleteConfirmation={showDeleteConfirmation}
    />
    <Stack
      display="flex"
      width="100%"
      alignItems="center"
      p={1}
      position="sticky"
      bottom={0}
      sx={{ bgcolor: "white" }}
    >
      <form
        onSubmit={handleSubmit(onSubmitNewMessage)}
        style={{ display: "flex", width: "100%" }}
      >
        <Stack
          display="flex"
          width="100%"
          alignItems="center"
          flexDirection="row"
        >
          {isThreadSelected && (
            <>
              <Controller
                name="message"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Chat in this thread"
                    fullWidth
                    variant="outlined"
                  />
                )}
              />
              <IconButton type="submit">
                <SendIcon />
              </IconButton>
            </>
          )}
        </Stack>
      </form>
    </Stack>
  </BgImage>
);

export default ChatPage;
