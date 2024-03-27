import { FC, useCallback, useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  createWebSocketConnection,
  closeWebSocketConnection,
} from "../Store/ws";
import { useAppDispatch, useAppSelector } from "../Store";
import {
  deleteAMessage,
  getActiveThreadInfo,
  selectActiveThread,
  selectMessages,
  selectThreads,
  sendAMessage,
  setMessageStatuses,
} from "../Store/threads";
import { selectUser } from "../Store/user";
import Stack from "@mui/material/Stack";
import ConfirmationDialog from "../Components/ConfirmationDialog";
import MessageModal from "./MessageModal";
import ChatPage from "../Components/ChatPage";
import * as obj from "../Utils/obj";
import * as yup from "yup";

const schema = yup.object().shape({
  message: yup
    .string()
    .trim()
    .max(191, "message cannot reach more than 191 characters")
    .required("You can't send empty messages"),
});

type ChatProps = {
  setErrorMessage: (error: string) => void;
};

const Chat: FC<ChatProps> = ({ setErrorMessage }) => {
  const dispatch = useAppDispatch();
  const threads = useAppSelector(selectThreads);
  const activeThread = useAppSelector(selectActiveThread);
  const messages = useAppSelector(selectMessages);
  const user = useAppSelector(selectUser);

  const { control, handleSubmit, reset } = useForm<ChatFormInputs>({
    resolver: yupResolver(schema),
  });

  const [messageToEdit, setEditOpenModal] = useState<string>("");
  const [messageToDelete, setDeleteDialogStatus] = useState<string>("");
  const webSocketRef = useRef<WebSocket | null>(null);
  const scrollbarRef = useRef<HTMLElement | null>(null);

  const onSubmitNewMessage: SubmitHandler<ChatFormInputs> = async (data) => {
    try {
      await dispatch(
        sendAMessage({
          ...user,
          userId: user.id,
          threadId: activeThread,
          checkSum: "sent",
          text: data.message,
        })
      );
      await dispatch(
        getActiveThreadInfo({ id: activeThread, userId: user.id })
      );
      reset();
    } catch (e) {
      const error = `Error: ${e}`;
      return setErrorMessage(error);
    }
  };

  const handleReSendMessage = useCallback(
    async (id: string) => {
      const reSendMessage = async () => {
        if (user.id && activeThread) {
          const newWebSocket = createWebSocketConnection(user.id, activeThread);
          webSocketRef.current = newWebSocket;

          await new Promise((resolve) => {
            newWebSocket.addEventListener("open", (event) => {
              console.info("WebSocket connection re-opened:", event);
              resolve(null);
            });
          });

          /**
           * Qui si potrebbe inviare nuovamente il messaggio nella WS così
           * const reSendMessageRequest = {
           *   type: "RESEND_MESSAGE",
           *   payload: {
           *     userId: user.id,
           *     messageId: id,
           *   },
           * };
           * newWebSocket.send(JSON.stringify(reSendMessageRequest));
           */

          dispatch(setMessageStatuses({ id, status: "sent" }));

          await dispatch(
            getActiveThreadInfo({ id: activeThread, userId: user.id })
          );
        }
      };

      await reSendMessage();

      return () => {
        if (webSocketRef.current) {
          closeWebSocketConnection(webSocketRef.current);
        }
      };
    },
    [user.id, activeThread, webSocketRef]
  );

  const handleDeleteMessage = useCallback(async () => {
    if (!messageToDelete) return;

    await dispatch(deleteAMessage({ userId: user.id, id: messageToDelete }));
    await dispatch(getActiveThreadInfo({ id: activeThread, userId: user.id }));

    return setDeleteDialogStatus("");
  }, [messageToDelete]);

  const editThisMessage = useCallback(
    (id: string) => setEditOpenModal(id),
    [messages, messageToEdit]
  );

  const closeEditModal = useCallback(() => {
    setEditOpenModal("");

    return reset();
  }, []);

  const showDeleteConfirmation = useCallback(
    (id: string) => setDeleteDialogStatus(id),
    []
  );

  const closeDeleteConfirmation = useCallback(
    () => setDeleteDialogStatus(""),
    []
  );

  useEffect(() => {
    const connectToWebSocket = async () => {
      if (user.id && activeThread) {
        if (webSocketRef.current) {
          closeWebSocketConnection(webSocketRef.current);
        }

        const newWebSocket = createWebSocketConnection(user.id, activeThread);
        webSocketRef.current = newWebSocket;
      }
    };

    connectToWebSocket();

    return () => {
      if (webSocketRef.current) {
        closeWebSocketConnection(webSocketRef.current);
      }
    };
  }, [user.id, activeThread]);

  useEffect(() => {
    if (scrollbarRef.current) {
      scrollbarRef.current.scrollTop = Number.MAX_SAFE_INTEGER;
    }
  }, [messages]);

  const thereAreMessageToShow = obj.size<Message>(messages);
  const isThreadSelected =
    Boolean(activeThread) && obj.has<Thread>(threads, activeThread);

  return (
    <Stack display="flex" width="75%" height="100%">
      <ConfirmationDialog
        confirm={handleDeleteMessage}
        undo={closeDeleteConfirmation}
        id={messageToDelete}
        cancelButtonText="undo"
        confirmButtonText="delete"
        title="Delete Message"
        dialogText="Are you sure you want to delete this message?"
      />
      <MessageModal
        closeModal={closeEditModal}
        schema={schema}
        messageToEdit={messageToEdit}
        defaultValue={obj.get<Message>(messages, messageToEdit).text}
        userId={user.id}
        activeThread={activeThread}
      />
      <ChatPage
        scrollbarRef={scrollbarRef}
        isThreadSelected={isThreadSelected}
        thereAreMessageToShow={thereAreMessageToShow}
        messages={messages}
        user={user}
        handleReSendMessage={handleReSendMessage}
        editThisMessage={editThisMessage}
        showDeleteConfirmation={showDeleteConfirmation}
        handleSubmit={handleSubmit}
        onSubmitNewMessage={onSubmitNewMessage}
        control={control}
      />
    </Stack>
  );
};

export default Chat;
